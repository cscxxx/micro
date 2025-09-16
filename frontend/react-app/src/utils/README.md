# Utils 工具函数说明

本目录包含应用的工具函数，提供各种通用功能。

## 文件结构

```
utils/
├── axios.js          # HTTP 请求配置
├── mimetype.js       # 文件类型处理工具
└── README.md         # 说明文档
```

## mimetype.js - 文件类型处理工具

### 主要功能

1. **MIME 类型检测**: 根据文件扩展名获取 MIME 类型
2. **文件类型判断**: 检查文件是否为特定类型（图片、视频、音频、文档）
3. **文件图标**: 根据文件扩展名获取对应的图标
4. **文件大小格式化**: 将字节数转换为可读的文件大小

### 核心函数

#### 1. getMimeTypeFromFilename(filename)

根据文件名获取 MIME 类型

```javascript
import { getMimeTypeFromFilename } from "../utils/mimetype";

const mimeType = getMimeTypeFromFilename("document.pdf");
console.log(mimeType); // 'application/pdf'
```

#### 2. getFileTypeIcon(filename)

根据文件名获取文件类型图标

```javascript
import { getFileTypeIcon } from "../utils/mimetype";

const icon = getFileTypeIcon("image.jpg");
console.log(icon); // '🖼️'
```

#### 3. 文件类型检查函数

```javascript
import {
  isImageFile,
  isVideoFile,
  isAudioFile,
  isDocumentFile,
} from "../utils/mimetype";

console.log(isImageFile("photo.png")); // true
console.log(isVideoFile("movie.mp4")); // true
console.log(isAudioFile("song.mp3")); // true
console.log(isDocumentFile("report.pdf")); // true
```

#### 4. formatFileSize(bytes)

格式化文件大小

```javascript
import { formatFileSize } from "../utils/mimetype";

console.log(formatFileSize(1024)); // '1 KB'
console.log(formatFileSize(1048576)); // '1 MB'
```

### 支持的文件类型

#### 图片类型

- jpg, jpeg, png, gif, bmp, webp, svg, ico, tiff, tif

#### 文档类型

- pdf, doc, docx, xls, xlsx, ppt, pptx, txt, rtf
- odt, ods, odp (OpenDocument 格式)

#### 音频类型

- mp3, wav, ogg, aac, flac, m4a, wma

#### 视频类型

- mp4, avi, mov, wmv, flv, webm, mkv, 3gp

#### 压缩文件类型

- zip, rar, 7z, tar, gz, bz2

#### 代码文件类型

- js, jsx, ts, tsx, html, css, scss, sass, less
- json, xml, yaml, yml

### 使用示例

#### 在文件下载组件中使用

```javascript
import { getMimeTypeFromFilename } from "../utils/mimetype";

const handleBinaryDownload = async (fileId, filename, originalMimetype) => {
  // 如果后端没有提供 mimetype 或 mimetype 无效，则根据文件名获取
  const mimetype =
    originalMimetype && originalMimetype !== "application/octet-stream"
      ? originalMimetype
      : getMimeTypeFromFilename(filename);

  const blob = new Blob([response.data], { type: mimetype });
  // ... 下载逻辑
};
```

#### 在文件列表组件中使用

```javascript
import { getFileTypeIcon, getMimeTypeFromFilename } from "../utils/mimetype";

const getFileIcon = (filename, mimetype) => {
  // 优先根据文件名获取图标
  if (filename) {
    return getFileTypeIcon(filename);
  }

  // 回退到基于 mimetype 的判断
  // ... 其他逻辑
};

const getActualMimetype = (originalMimetype, filename) => {
  return originalMimetype && originalMimetype !== "application/octet-stream"
    ? originalMimetype
    : getMimeTypeFromFilename(filename);
};
```

### 优势

1. **全面支持**: 支持常见的文件类型
2. **智能回退**: 当后端没有提供 MIME 类型时自动根据文件名获取
3. **类型安全**: 提供类型检查函数
4. **易于扩展**: 可以轻松添加新的文件类型支持
5. **性能优化**: 使用映射表快速查找

### 注意事项

1. 文件名参数应该是字符串类型
2. 如果文件名没有扩展名，会返回默认的 `application/octet-stream`
3. 扩展名不区分大小写
4. 图标映射基于文件扩展名，不是 MIME 类型

### 扩展支持

要添加新的文件类型支持，只需在 `mimeTypes` 对象中添加新的映射：

```javascript
const mimeTypes = {
  // 现有类型...
  newtype: "application/x-new-type",
};
```

在 `iconMap` 中添加对应的图标：

```javascript
const iconMap = {
  // 现有图标...
  newtype: "🆕",
};
```
