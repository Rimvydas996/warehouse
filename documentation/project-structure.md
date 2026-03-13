# Project Structure Documentation (Backend)

## Root Directory Structure

```
warehouse/
├── api/                 # Serverless entry (Vercel)
├── documentation/       # Project documentation
├── node_modules/        # Project dependencies
├── package.json         # Dependencies and scripts
├── package-lock.json    # Dependency lockfile
├── src/                 # Application source
└── vercel.json          # Vercel configuration
```

## Source Code Directory (`src/`)

```
src/
├── app.js               # Express app setup, routes, middleware
├── server.js            # Local server bootstrap
├── controllers/         # HTTP controllers
├── middlewares/         # Express middlewares
├── models/              # Mongoose schemas
├── repositories/        # Database access layer
├── routes/              # API route definitions
├── services/            # Business logic and integration services
└── utils/               # Shared helpers and error utilities
    └── errors/          # AppError, error types
```

## API Entry (`api/`)

```
api/
└── index.js             # Exports the Express app for serverless deployment
```

## Documentation Directory

```
documentation/
├── project-docs.md           # General project documentation
├── coding-guidelines.md      # Backend coding standards
└── project-structure.md      # This file
```

## Key Files Description

### Root Level

- `package.json`: Dependencies and scripts
- `vercel.json`: Deployment configuration

### Application

- `src/app.js`: Express app configuration, routes, and middleware
- `src/server.js`: Local server start script
- `api/index.js`: Vercel entrypoint

### Layers

- `controllers/`: Request/response handling
- `services/`: Business logic orchestration
- `repositories/`: Mongoose query and persistence logic
- `routes/`: Express routes and wiring
- `middlewares/`: Auth, CORS, and error handling
- `models/`: Mongoose schemas
- `utils/errors/`: Error types and helpers

## Conventions

- Business logic should live in `services/`
- Database access should be isolated in `repositories/`
- Controllers should be thin and focus on HTTP concerns
