const AuditLog = require("../models/auditLogModel");

const writeLog = async (level, message, metadata) => {
  try {
    await AuditLog.create({ level, message, metadata });
  } catch (error) {
    // Logging must never prevent an API response from being returned.
    console.error("Failed to write audit log:", error.message);
  }
};

const logger = {
  info: (message, metadata = {}) => writeLog("info", message, metadata),
  warn: (message, metadata = {}) => writeLog("warn", message, metadata),
  error: (message, metadata = {}) => writeLog("error", message, metadata),
};

// Records a completed request without logging credentials, tokens, or bodies.
const auditLoggerMiddleware = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const metadata = {
      method: req.method,
      path: req.originalUrl.split("?")[0],
      ip: req.ip,
      userId: req.user?.id || null,
      username: req.user?.username || null,
      email: req.user?.email || null,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    };
    const message = `${metadata.method} ${metadata.path} - ${metadata.statusCode}`;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    logger[level](message, metadata);
  });

  next();
};

module.exports = { logger, auditLoggerMiddleware };
