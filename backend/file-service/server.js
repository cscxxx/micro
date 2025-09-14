const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");
const iconv = require("iconv-lite");
const formidable = require("formidable");
const config = require("../config");

const app = express();
const serviceConfig = config.getServiceConfig("file");

// 中间件
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置正确的编码
app.use((req, res, next) => {
  req.setEncoding("utf8");
  next();
});

// 确保files目录存在
const filesDir = path.join(__dirname, "../files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// 数据库连接配置
const dbConfig = config.getDatabaseConfig("file");

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
    // 检查是否包含乱码字符
    if (
      filename.includes("æ") ||
      filename.includes("å") ||
      filename.includes("ä") ||
      filename.includes("ö")
    ) {
      // 使用iconv-lite从latin1转换为utf8
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
    // 生成唯一文件名：时间戳_原文件名
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // 使用辅助函数处理中文文件名
    const safeName = fixChineseFileName(name);
    const safeExt = fixChineseFileName(ext);

    cb(null, `${safeName}_${uniqueSuffix}${safeExt}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // 暂时允许所有文件类型
    cb(null, true);
  },
  preservePath: true,
});

// 使用formidable的文件上传接口（支持中文文件名）
app.post("/api/files/upload-formidable", async (req, res) => {
  try {
    const form = formidable({
      uploadDir: filesDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: function ({ name, originalFilename, mimetype }) {
        // 允许所有文件类型
        return true;
      },
    });

    const [fields, files] = await form.parse(req);

    if (!files.file || files.file.length === 0) {
      return res.status(400).json({ error: "没有上传文件" });
    }

    const file = files.file[0];
    const description = fields.description ? fields.description[0] : "";

    // 生成唯一文件名
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalFilename);
    const name = path.basename(file.originalFilename, ext);
    const newFilename = `${name}_${uniqueSuffix}${ext}`;
    const newPath = path.join(filesDir, newFilename);

    // 重命名文件
    fs.renameSync(file.filepath, newPath);

    const fileInfo = {
      filename: newFilename,
      originalname: file.originalFilename, // formidable正确处理中文文件名
      mimetype: file.mimetype,
      size: file.size,
      path: newPath,
      description: description,
    };

    // 保存文件信息到数据库
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
      file: {
        id: result.insertId,
        ...fileInfo,
        upload_time: new Date(),
      },
    });
  } catch (error) {
    console.error("文件上传失败:", error);
    res.status(500).json({ error: "文件上传失败: " + error.message });
  }
});

// 文件上传接口
app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "没有上传文件" });
    }

    const { description } = req.body;
    const fileInfo = {
      filename: req.file.filename,
      originalname: fixChineseFileName(req.file.originalname), // 修复原始文件名
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      description: description || "",
    };

    // 保存文件信息到数据库
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
      file: {
        id: result.insertId,
        ...fileInfo,
        upload_time: new Date(),
      },
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

    if (rows.length === 0) {
      return res.status(404).json({ error: "文件不存在" });
    }

    const file = rows[0];
    const filePath = file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "文件不存在" });
    }

    res.download(filePath, file.originalname, (err) => {
      if (err) {
        console.error("文件下载失败:", err);
        res.status(500).json({ error: "文件下载失败" });
      }
    });
  } catch (error) {
    console.error("文件下载失败:", error);
    res.status(500).json({ error: "文件下载失败" });
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
