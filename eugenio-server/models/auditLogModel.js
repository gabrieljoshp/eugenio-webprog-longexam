const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ["info", "warn", "error"], required: true },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

module.exports = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema, "audit_logs");
