import { ratelimit } from "../config/upstash";
import { Request, Response, NextFunction } from "express";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use IP address as identifier for rate limiting
    const identifier = req.ip || req.socket.remoteAddress || "unknown";

    const result = await ratelimit.limit(identifier);

    // Log rate limit status for debugging
    console.log(
      `Rate limit check - Identifier: ${identifier}, Success: ${result.success}, Remaining: ${result.remaining}, Limit: ${result.limit}`
    );

    if (!result.success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset).toISOString(),
      });
    }

    // Add rate limit headers to response
    res.setHeader("X-RateLimit-Limit", result.limit.toString());
    res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
    res.setHeader("X-RateLimit-Reset", new Date(result.reset).toISOString());

    next();
  } catch (error) {
    console.error("Rate limit error:", error);

    next(error);
  }
};

export default rateLimiter;
