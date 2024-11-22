const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // limit each IP to 5 login attempts per window
  // Skip rate limiting for trusted IPs
  /*
  skip: (req) => {
    const trustedIPs = ["192.168.1.1", "192.168.1.2"];
    return trustedIPs.includes(req.ip);
  },
  */
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts, please try again after 15 minutes",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
    });
  },
});

module.exports = {
  authLimiter,
};
