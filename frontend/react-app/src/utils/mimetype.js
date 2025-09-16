/**
 * 根据文件扩展名获取 MIME 类型
 * @param {string} filename - 文件名
 * @returns {string} - MIME 类型
 */
export const getMimeTypeFromFilename = (filename) => {
  if (!filename || typeof filename !== "string") {
    return "application/octet-stream";
  }

  // 获取文件扩展名（不区分大小写）
  const extension = filename.split(".").pop()?.toLowerCase();

  if (!extension) {
    return "application/octet-stream";
  }

  // MIME 类型映射表
  const mimeTypes = {
    // 图片类型
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    tiff: "image/tiff",
    tif: "image/tiff",

    // 文档类型
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    rtf: "application/rtf",
    odt: "application/vnd.oasis.opendocument.text",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odp: "application/vnd.oasis.opendocument.presentation",

    // 音频类型
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    aac: "audio/aac",
    flac: "audio/flac",
    m4a: "audio/mp4",
    wma: "audio/x-ms-wma",

    // 视频类型
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    wmv: "video/x-ms-wmv",
    flv: "video/x-flv",
    webm: "video/webm",
    mkv: "video/x-matroska",
    "3gp": "video/3gpp",

    // 压缩文件类型
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    "7z": "application/x-7z-compressed",
    tar: "application/x-tar",
    gz: "application/gzip",
    bz2: "application/x-bzip2",

    // 代码文件类型
    js: "application/javascript",
    jsx: "text/jsx",
    ts: "application/typescript",
    tsx: "text/tsx",
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    scss: "text/scss",
    sass: "text/sass",
    less: "text/less",
    json: "application/json",
    xml: "application/xml",
    yaml: "application/x-yaml",
    yml: "application/x-yaml",

    // 其他类型
    csv: "text/csv",
    sql: "application/sql",
    log: "text/plain",
    md: "text/markdown",
    markdown: "text/markdown",
    sh: "application/x-sh",
    bat: "application/x-msdownload",
    exe: "application/x-msdownload",
    dmg: "application/x-apple-diskimage",
    iso: "application/x-iso9660-image",
  };

  return mimeTypes[extension] || "application/octet-stream";
};

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} - 文件扩展名（小写）
 */
export const getFileExtension = (filename) => {
  if (!filename || typeof filename !== "string") {
    return "";
  }
  return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * 检查文件是否为图片类型
 * @param {string} filename - 文件名
 * @returns {boolean} - 是否为图片
 */
export const isImageFile = (filename) => {
  const mimeType = getMimeTypeFromFilename(filename);
  return mimeType.startsWith("image/");
};

/**
 * 检查文件是否为视频类型
 * @param {string} filename - 文件名
 * @returns {boolean} - 是否为视频
 */
export const isVideoFile = (filename) => {
  const mimeType = getMimeTypeFromFilename(filename);
  return mimeType.startsWith("video/");
};

/**
 * 检查文件是否为音频类型
 * @param {string} filename - 文件名
 * @returns {boolean} - 是否为音频
 */
export const isAudioFile = (filename) => {
  const mimeType = getMimeTypeFromFilename(filename);
  return mimeType.startsWith("audio/");
};

/**
 * 检查文件是否为文档类型
 * @param {string} filename - 文件名
 * @returns {boolean} - 是否为文档
 */
export const isDocumentFile = (filename) => {
  const mimeType = getMimeTypeFromFilename(filename);
  return (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("excel") ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("text") ||
    mimeType.includes("rtf") ||
    mimeType.includes("oasis")
  );
};

/**
 * 获取文件类型图标（基于扩展名）
 * @param {string} filename - 文件名
 * @returns {string} - 图标字符
 */
export const getFileTypeIcon = (filename) => {
  const extension = getFileExtension(filename);

  const iconMap = {
    // 图片
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    bmp: "🖼️",
    webp: "🖼️",
    svg: "🖼️",

    // 文档
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    txt: "📄",
    rtf: "📄",
    xls: "📊",
    xlsx: "📊",
    csv: "📊",
    ppt: "📈",
    pptx: "📈",

    // 音频
    mp3: "🎵",
    wav: "🎵",
    ogg: "🎵",
    aac: "🎵",
    flac: "🎵",

    // 视频
    mp4: "🎬",
    avi: "🎬",
    mov: "🎬",
    wmv: "🎬",
    flv: "🎬",
    webm: "🎬",

    // 压缩文件
    zip: "📦",
    rar: "📦",
    "7z": "📦",
    tar: "📦",
    gz: "📦",

    // 代码文件
    js: "📜",
    jsx: "📜",
    ts: "📜",
    tsx: "📜",
    html: "📜",
    css: "📜",
    json: "📜",
    xml: "📜",
    yaml: "📜",
    yml: "📜",

    // 其他
    exe: "⚙️",
    dmg: "💿",
    iso: "💿",
  };

  return iconMap[extension] || "📁";
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} - 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
