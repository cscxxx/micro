# 🤝 贡献指南

感谢您对微服务管理系统项目的关注！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 报告 Bug
- ✨ 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🧪 添加测试用例

## 📋 贡献流程

### 1. Fork 项目

1. 点击项目页面右上角的 "Fork" 按钮
2. 将 Fork 的仓库克隆到本地：

```bash
git clone https://github.com/your-username/micro.git
cd micro
```

### 2. 创建分支

```bash
# 创建并切换到新分支
git checkout -b feature/your-feature-name

# 或修复 Bug
git checkout -b fix/your-bug-description
```

### 3. 开发环境设置

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend/react-app
npm install

# 设置数据库
cd ../../backend
npm run setup
```

### 4. 进行开发

- 遵循项目的代码规范
- 添加必要的测试用例
- 更新相关文档
- 确保所有测试通过

### 5. 提交代码

```bash
# 添加修改的文件
git add .

# 提交更改（使用规范的提交信息）
git commit -m "feat: 添加新功能描述"
# 或
git commit -m "fix: 修复问题描述"
```

### 6. 推送并创建 Pull Request

```bash
# 推送到您的 Fork
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## 📝 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 提交格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 示例

```bash
feat(auth): 添加用户注册功能
fix(api): 修复产品列表分页问题
docs(readme): 更新快速开始指南
```

## 🧪 测试

### 运行测试

```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend/react-app
npm test
```

### 测试覆盖率

确保新代码有足够的测试覆盖率：

```bash
# 前端测试覆盖率
cd frontend/react-app
npm test -- --coverage
```

## 📏 代码规范

### JavaScript/Node.js

- 使用 ES6+ 语法
- 使用 `const`/`let` 替代 `var`
- 使用箭头函数
- 使用模板字符串
- 使用解构赋值

### React

- 使用函数组件和 Hooks
- 使用 PropTypes 或 TypeScript 进行类型检查
- 组件名使用 PascalCase
- 文件名使用 PascalCase

### 文件命名

- 组件文件：`ComponentName.jsx`
- 工具文件：`utilityName.js`
- 常量文件：`CONSTANTS.js`

## 📚 文档

### 更新文档

- 新功能需要更新相关文档
- API 变更需要更新 API 文档
- 配置变更需要更新配置说明

### 文档位置

- 用户文档：`docs/getting-started/`
- API 文档：`docs/api/`
- 开发文档：`docs/development/`
- 功能文档：`docs/features/`

## 🐛 报告 Bug

### Bug 报告模板

```markdown
**Bug 描述**
简要描述 Bug 的情况。

**重现步骤**
1. 进入 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

**预期行为**
描述您期望发生的情况。

**实际行为**
描述实际发生的情况。

**环境信息**
- 操作系统: [e.g. macOS, Windows, Linux]
- Node.js 版本: [e.g. 18.0.0]
- 浏览器: [e.g. Chrome, Safari]
- 版本: [e.g. 22]

**附加信息**
添加任何其他相关信息。
```

## ✨ 功能请求

### 功能请求模板

```markdown
**功能描述**
简要描述您希望添加的功能。

**使用场景**
描述这个功能的使用场景。

**解决方案**
描述您建议的解决方案。

**替代方案**
描述您考虑过的其他解决方案。

**附加信息**
添加任何其他相关信息。
```

## 🔍 代码审查

### 审查清单

- [ ] 代码符合项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 没有破坏现有功能
- [ ] 提交信息清晰明确

### 审查流程

1. 自动检查（CI/CD）
2. 代码审查
3. 测试验证
4. 合并代码

## 📞 获取帮助

如果您在贡献过程中遇到问题，可以通过以下方式获取帮助：

1. 查看 [故障排除指南](docs/getting-started/troubleshooting.md)
2. 查看 [开发指南](docs/development/guide.md)
3. 创建 Issue 描述问题
4. 联系维护者

## 🎉 感谢

感谢所有为项目做出贡献的开发者！您的贡献让项目变得更好。

---

**开始贡献**: [Fork 项目](https://github.com/your-username/micro/fork) | **查看文档**: [开发指南](docs/development/guide.md) | **报告问题**: [创建 Issue](https://github.com/your-username/micro/issues)
