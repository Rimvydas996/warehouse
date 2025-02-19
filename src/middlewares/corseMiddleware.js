// CORS (Cross-Origin Resource Sharing) middleware configuration
// This module handles CORS requests and only allows requests from permitted domains

const ALLOWED_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "localhost:3000", // Common React development server
  "localhost:5173",
  "warehouse-app-mocha.vercel.app", // Common Vite development server
];

const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
const ALLOWED_HEADERS = ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"];

/**
 * Middleware for handling Cross-Origin Resource Sharing (CORS) requests.
 *
 * This function checks the incoming request's 'Origin' header to determine if
 * the request's origin domain is among the allowed domains. If the domain is
 * allowed, it sets appropriate CORS headers. It also handles preflight OPTIONS
 * requests by responding with a 200 status code.
 *
 * @param {Object} req - HTTP request object containing all request information
 * @param {Object} res - HTTP response object used to send the response
 * @param {Function} next - Function to pass control to the next middleware
 */
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return next();
  }

  try {
    const url = new URL(origin);
    const hostname = url.host; // Using host instead of hostname to include port

    if (ALLOWED_DOMAINS.includes(hostname)) {
      // Set CORS headers
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
      res.header("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Vary", "Origin"); // Important for caching
    } else {
      console.warn(`Blocked request from unauthorized domain: ${hostname}`);
    }
  } catch (error) {
    console.error("Invalid origin address:", origin, error.message);
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

module.exports = corsMiddleware;
