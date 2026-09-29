const rateLimit = require("express-rate-limit");

const failedLogins = new Map();
const lockDurations = [
  { attempts: 10, minutes: 30 },
  { attempts: 8, minutes: 5 },
  { attempts: 5, minutes: 3 },
];
const loginKey = (req) => `${req.ip}:${String(req.body?.email || "unknown").toLowerCase()}`;

// Stops an account/IP pair during the progressive cooldown window.
const loginLockout = (req, res, next) => {
  const record = failedLogins.get(loginKey(req));
  if (!record || record.lockedUntil <= Date.now()) return next();

  const retryAfter = Math.ceil((record.lockedUntil - Date.now()) / 1000);
  res.set("Retry-After", String(retryAfter));
  return res.status(429).json({
    success: false,
    message: "Too many failed login attempts",
    error: `Try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
  });
};

// Counts completed login responses. A successful login clears the failure record.
const trackLoginAttempt = (req, res, next) => {
  res.on("finish", () => {
    const key = loginKey(req);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      failedLogins.delete(key);
      return;
    }
    if (res.statusCode !== 401) return;

    const previous = failedLogins.get(key) || { attempts: 0, lockedUntil: 0 };
    const attempts = previous.attempts + 1;
    const rule = lockDurations.find(({ attempts: threshold }) => attempts >= threshold);
    failedLogins.set(key, {
      attempts,
      lockedUntil: rule ? Date.now() + rule.minutes * 60 * 1000 : 0,
    });
  });
  next();
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again after 15 minutes." },
});

module.exports = { loginLimiter, loginLockout, trackLoginAttempt };
