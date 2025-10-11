const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");
const iconv = require("iconv-lite");
const formidable = require("formidable");
const config = require("./config");

const app = express();
const serviceConfig = config.service;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 注意：不要对请求设置字符串编码，避免破坏二进制上传（如multipart/form-data）

// 确保files目录存在
const filesDir = path.join(__dirname, "../files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// 数据库连接配置
const dbConfig = config.database;

// 创建数据库连接
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database");

    // 创建文件表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        originalname VARCHAR(255) NOT NULL,
        mimetype VARCHAR(100) NOT NULL,
        size INT NOT NULL,
        path VARCHAR(500) NOT NULL,
        upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT,
        INDEX idx_filename (filename),
        INDEX idx_upload_time (upload_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log("Files table created or verified");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

// 处理中文文件名乱码的辅助函数
function fixChineseFileName(filename) {
  try {
    if (
      filename.includes("æ") ||
      filename.includes("å") ||
      filename.includes("ä") ||
      filename.includes("ö")
    ) {
      const buffer = Buffer.from(filename, "latin1");
      return iconv.decode(buffer, "utf8");
    }
    return filename;
  } catch (e) {
    return filename;
  }
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const safeName = fixChineseFileName(name);
    const safeExt = fixChineseFileName(ext);
    cb(null, `${safeName}_${uniqueSuffix}${safeExt}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => cb(null, true),
});

// 文件上传接口
app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "没有上传文件" });
    }

    const { description } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const mimeMap = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };

    const fileInfo = {
      filename: req.file.filename,
      originalname: fixChineseFileName(req.file.originalname),
      mimetype:
        req.file.mimetype !== "application/octet-stream"
          ? req.file.mimetype
          : mimeMap[ext] || "application/octet-stream",
      size: req.file.size,
      path: req.file.path,
      description: description || "",
    };

    const [result] = await db.execute(
      "INSERT INTO files (filename, originalname, mimetype, size, path, description) VALUES (?, ?, ?, ?, ?, ?)",
      [
        fileInfo.filename,
        fileInfo.originalname,
        fileInfo.mimetype,
        fileInfo.size,
        fileInfo.path,
        fileInfo.description,
      ]
    );

    res.json({
      message: "文件上传成功",
      file: { id: result.insertId, ...fileInfo, upload_time: new Date() },
    });
  } catch (error) {
    console.error("文件上传失败:", error);
    res.status(500).json({ error: "文件上传失败: " + error.message });
  }
});

// 根路径
app.get("/", (req, res) => {
  res.json({
    message: `${serviceConfig.name} is running`,
    port: serviceConfig.port,
    baseUrl: serviceConfig.baseUrl,
  });
});

// 获取文件列表
app.get("/api/files", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM files";
    let countQuery = "SELECT COUNT(*) as total FROM files";

    if (search) {
      const searchPattern = `%${search}%`;
      query += ` WHERE originalname LIKE '${searchPattern}' OR description LIKE '${searchPattern}'`;
      countQuery += ` WHERE originalname LIKE '${searchPattern}' OR description LIKE '${searchPattern}'`;
    }

    query += ` ORDER BY upload_time DESC LIMIT ${parseInt(
      limit
    )} OFFSET ${parseInt(offset)}`;

    const [files] = await db.execute(query);
    const [countResult] = await db.execute(countQuery);
    const total = countResult[0].total;

    res.json({
      files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取文件列表失败:", error);
    res.status(500).json({ error: "获取文件列表失败" });
  }
});

// 文件下载接口
app.get("/api/files/download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM files WHERE id = ?", [id]);

    if (rows.length === 0 || !fs.existsSync(rows[0].path)) {
      return res.status(404).json({ error: "文件不存在" });
    }

    const file = rows[0];
    const basename = path.basename(
      file.originalname || path.basename(file.path)
    );

    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Disposition, Content-Type, Content-Length"
    );
    res.download(file.path, basename, (err) => {
      if (err && !res.headersSent) {
        console.error("文件下载失败:", err);
        res.status(500).json({ error: "文件下载失败" });
      }
    });
  } catch (error) {
    console.error("文件下载失败:", error);
    res.status(500).json({ error: "文件下载失败" });
  }
});

// 获取文件二进制数据接口
app.get("/api/files/binary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM files WHERE id = ?", [id]);

    if (rows.length === 0 || !fs.existsSync(rows[0].path)) {
      return res.status(404).json({ error: "文件不存在" });
    }

    const file = rows[0];

    // 读取文件二进制数据
    const fileBuffer = fs.readFileSync(file.path);

    // 设置响应头
    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Length", file.size);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.originalname)}"`
    );
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Disposition, Content-Type, Content-Length"
    );

    // 返回二进制数据
    res.send(fileBuffer);
  } catch (error) {
    console.error("获取文件二进制数据失败:", error);
    res.status(500).json({ error: "获取文件二进制数据失败" });
  }
});

// 删除文件接口
app.delete("/api/files/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM files WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "文件不存在" });
    }

    const file = rows[0];
    const filePath = file.path;

    // 删除数据库记录
    await db.execute("DELETE FROM files WHERE id = ?", [id]);

    // 删除物理文件
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "文件删除成功" });
  } catch (error) {
    console.error("文件删除失败:", error);
    res.status(500).json({ error: "文件删除失败" });
  }
});

// 获取文件信息
app.get("/api/files/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM files WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "文件不存在" });
    }

    res.json({ file: rows[0] });
  } catch (error) {
    console.error("获取文件信息失败:", error);
    res.status(500).json({ error: "获取文件信息失败" });
  }
});

// 批量删除文件
app.delete("/api/files/batch", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "请提供要删除的文件ID列表" });
    }

    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await db.execute(
      `SELECT * FROM files WHERE id IN (${placeholders})`,
      ids
    );

    // 删除物理文件
    for (const file of rows) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    // 删除数据库记录
    await db.execute(`DELETE FROM files WHERE id IN (${placeholders})`, ids);

    res.json({ message: `成功删除 ${rows.length} 个文件` });
  } catch (error) {
    console.error("批量删除文件失败:", error);
    res.status(500).json({ error: "批量删除文件失败" });
  }
});

// 健康检查
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "file-service",
    timestamp: new Date().toISOString(),
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "文件大小超过限制(50MB)" });
    }
  }
  res.status(500).json({ error: error.message });
});

// 启动服务器
async function startServer() {
  await connectDB();

  app.listen(serviceConfig.port, () => {
    console.log(`${serviceConfig.name} running on port ${serviceConfig.port}`);
    console.log(`Base URL: ${serviceConfig.baseUrl}`);
    console.log(`Files directory: ${filesDir}`);
  });
}

startServer().catch(console.error);
