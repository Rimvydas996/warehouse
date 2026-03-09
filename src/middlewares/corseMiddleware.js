const ALLOWED_DOMAINS = [
    "localhost",
    "127.0.0.1",
    "localhost:3001",
    "localhost:5173",
    "warehouse-app-mocha.vercel.app",
];

const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
const ALLOWED_HEADERS = ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"];

const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;

    if (origin) {
        try {
            const url = new URL(origin);
            const hostname = url.host; // includes port if any

            if (ALLOWED_DOMAINS.includes(hostname)) {
                // Set CORS headers for allowed domains
                res.header("Access-Control-Allow-Origin", origin);
            } else {
                console.warn(`Blocked request from unauthorized domain: ${hostname}`);
            }

            // These headers should always be sent for preflight
            res.header("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
            res.header("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Vary", "Origin");
        } catch (error) {
            console.error("Invalid origin address:", origin, error.message);
        }
    }

    // Preflight OPTIONS request must respond 200
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
};

module.exports = corsMiddleware;
