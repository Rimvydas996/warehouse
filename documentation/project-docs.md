# Warehouse Backend Documentation

## Project Overview

This repository contains the backend for the warehouse management system. It is a Node.js and Express API that handles authentication, inventory operations, and warehouse data access using MongoDB via Mongoose.

## Key Endpoints

- `GET /health`: Service and database connection status
- `POST /auth/*`: Authentication endpoints
- `/warehouse/*`: Warehouse operations (protected by auth middleware)

## Project Structure (High Level)

```
warehouse/
├── api/                 # Serverless entry (Vercel)
├── src/                 # Application source code
└── documentation/       # Project documentation
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (see below).

3. Start the API locally:

```bash
npm run dev
```
Or for a plain start:

```bash
npm run start
```

## Technical Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)

## Environment Configuration

Required environment variables:

- `MONGODB_USER`: MongoDB username
- `MONGODB_PASSWORD`: MongoDB password
- `MONGODB_CLUSTER`: MongoDB cluster host
- `MONGODB_DB`: MongoDB database name
- `JWT_SECRET`: Secret for signing JWTs
- `NODE_ENV`: `development` or `production`
- `NODE_DEBUG`: Set to `true` to enable error debug logging

Optional environment variables:

- `PORT`: Server port override (defaults to `3001`)

## Entry Points

- `src/app.js`: Express app with routes and middleware
- `src/server.js`: Local server bootstrap
- `api/index.js`: Vercel entry that exports the app

## Request Lifecycle (High Level)

1. `src/server.js` starts the server and mounts the Express app from `src/app.js`
2. `src/app.js` wires middleware, connects to the database, and mounts routes
3. Controllers delegate to services and repositories
4. Errors are handled by the global error handler

## Deployment

This project includes `vercel.json` for deployment. The serverless entrypoint is `api/index.js`.

## Logging and Errors

- Debug logs are guarded by `NODE_DEBUG=true`
- Operational errors should use `AppError` and flow through the global error handler

## Future Documentation

- API contract and request/response examples
- Error codes and expected error shapes
- Authentication flows
