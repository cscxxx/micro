# Nginx 配置部署指南

## 📁 项目文件

- `index.html` - 网站主页
- `nginx-react-app.conf` - Nginx 配置文件
- `Readme.md` - 说明文档

## 🚀 快速部署

### 1. 上传配置

> 有权限问题，所以一般先上传到用户目录下，然后再移动到 nginx 配置目录下

```bash
scp -P 22 nginx-react-app.conf csc@192.168.1.2:~/
```

### 2. 服务器配置

```bash
ssh -p 22 csc@192.168.1.2
sudo cp ~/nginx-react-app.conf /etc/nginx/sites-available/
sudo chown root:root /etc/nginx/sites-available/nginx-react-app.conf
sudo chmod 644 /etc/nginx/sites-available/nginx-react-app.conf
```

### 3. 启用配置

```bash
#  创建nginx配置软链接到sites-enabled目录下
sudo ln -s /etc/nginx/sites-available/nginx-react-app.conf /etc/nginx/sites-enabled/
#  查看sites-enabled目录下的配置文件
ls /etc/nginx/sites-enabled/
#  禁用配置
sudo unlink /etc/nginx/sites-enabled/nginx-react-app.conf
#  检查ngixn的配置
sudo nginx -t
#  重新加载ngninx配置
sudo systemctl reload nginx
```

## 🛠️ 常用命令

| 操作     | 命令                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| 启用配置 | `sudo ln -s /etc/nginx/sites-available/nginx-react-app.conf /etc/nginx/sites-enabled/` |
| 禁用配置 | `sudo unlink /etc/nginx/sites-enabled/nginx-react-app.conf`                            |
| 测试配置 | `sudo nginx -t`                                                                        |
| 重载配置 | `sudo systemctl reload nginx`                                                          |

## 🌐 访问地址

http://192.168.1.2

## 📝 注意事项

- 配置文件权限：`644`，所有者：`root:root`
- 每次修改后运行 `sudo nginx -t` 测试
- 使用软链接管理配置，不要直接复制文件
