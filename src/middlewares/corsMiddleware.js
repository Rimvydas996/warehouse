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
            const { hostname, port } = new URL(origin);
            const domain = port ? `${hostname}:${port}` : hostname;

            if (ALLOWED_DOMAINS.includes(domain) || ALLOWED_DOMAINS.includes(hostname)) {
                res.setHeader("Access-Control-Allow-Origin", origin);
                res.setHeader("Access-Control-Allow-Credentials", "true");
            }
        } catch (err) {
            console.error("Invalid origin:", origin);
        }
    }

    res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
    res.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
    res.setHeader("Vary", "Origin");

    if (req.method === "OPTIONS") return res.status(200).end();
    next();
};

module.exports = corsMiddleware;
