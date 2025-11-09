const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config");

const app = express();
const serviceConfig = config.service;
const dbConfig = config.database;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection(dbConfig);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log(`Connected to MySQL database: ${dbConfig.database}`);
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: `${serviceConfig.name} is running`,
    port: serviceConfig.port,
    baseUrl: serviceConfig.baseUrl,
  });
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// 用户注册接口
app.post("/api/users/register", async (req, res) => {
  debugger;
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
          return res.status(400).json({ error: "用户名或邮箱已存在" });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建用户
        db.query(
          "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)",
          [username, email, hashedPassword, username], // 使用用户名作为默认name
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.json({
              message: "用户注册成功",
              user: {
                id: result.insertId,
                username,
                email,
              },
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 用户登录接口
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "用户名或密码错误" });
        }

        const user = results[0];

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: "用户名或密码错误" });
        }

        // 生成JWT token
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          config.jwt.secret,
          { expiresIn: config.jwt.expiresIn }
        );

        res.json({
          message: "登录成功",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
});

// 验证token的中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "访问令牌缺失" });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "无效的访问令牌" });
    }
    req.user = user;
    next();
  });
};

// 获取当前用户信息
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
});

// 忘记密码接口
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // 查找用户
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        // 为了安全，即使用户不存在也返回成功消息
        return res.json({
          message: "如果该邮箱存在，我们已发送密码重置链接",
        });
      }

      const user = results[0];

      // 生成重置token
      const resetToken = jwt.sign(
        { id: user.id, email: user.email, type: "password_reset" },
        config.jwt.secret,
        { expiresIn: "1h" }
      );

      // 这里应该发送邮件，但为了演示，我们只返回成功消息
      console.log(
        `密码重置链接: http://localhost:5173/reset-password?token=${resetToken}`
      );

      res.json({
        message: "密码重置链接已发送到您的邮箱",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 重置密码接口
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 验证重置token
    jwt.verify(token, config.jwt.secret, async (err, decoded) => {
      if (err || decoded.type !== "password_reset") {
        return res.status(400).json({ error: "无效或过期的重置链接" });
      }

      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 更新密码
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, decoded.id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({
            message: "密码重置成功，请使用新密码登录",
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建用户接口（需要认证）
app.post("/api/users", authenticateToken, (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: result.insertId, name, email });
      }
    }
  );
});

// 更新用户接口（需要认证）
app.put("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    // 检查用户是否存在
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "用户不存在" });
      }

      // 检查用户名和邮箱是否被其他用户使用
      db.query(
        "SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?",
        [username, email, id],
        (err, existingUsers) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (existingUsers.length > 0) {
            return res
              .status(400)
              .json({ error: "用户名或邮箱已被其他用户使用" });
          }

          // 更新用户信息
          db.query(
            "UPDATE users SET username = ?, email = ? WHERE id = ?",
            [username, email, id],
            (err, result) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              res.json({
                message: "用户信息更新成功",
                user: {
                  id: parseInt(id),
                  username,
                  email,
                },
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除用户接口（需要认证）
app.delete("/api/users/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // 防止用户删除自己
    if (parseInt(id) === currentUserId) {
      return res.status(400).json({ error: "不能删除自己的账户" });
    }

    // 检查用户是否存在
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "用户不存在" });
      }

      const user = results[0];

      // 删除用户
      db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          message: "用户删除成功",
          deletedUser: {
            id: parseInt(id),
            username: user.username,
            email: user.email,
          },
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(serviceConfig.port, () => {
  console.log(`${serviceConfig.name} running on port ${serviceConfig.port}`);
  console.log(`Base URL: ${serviceConfig.baseUrl}`);
});
