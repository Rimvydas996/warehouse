# Coding Guidelines and Best Practices (Backend)

These guidelines keep the backend consistent, secure, and easy to evolve. Prefer clarity over cleverness.

## 1. JavaScript and Runtime Conventions

- Use Node.js CommonJS modules (`require`/`module.exports`) to match the existing codebase
- Prefer `const` by default; use `let` only when reassignment is required
- Keep functions small and single-purpose
- Avoid side effects at module load time (except configuration and wiring)
- Avoid implicit type coercion; use strict equality
- Prefer early returns to reduce nesting

Example:
```js
const { getUserById } = require("../repositories/userRepository");

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.userId);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};
```

## 2. Architecture and Layering

- Follow the Controller -> Service -> Repository pattern
- Routes only define HTTP surface and wiring
- Controllers handle request/response shape and call services
- Keep business logic in services, not in routes/controllers
- Repositories encapsulate all database queries
- Always `return` responses to avoid double sends

## 3. SOLID Principles (Applied)

- Single Responsibility: one reason to change per module
- Open/Closed: extend behavior via new modules rather than editing core logic
- Liskov Substitution: keep interfaces consistent across implementations
- Interface Segregation: keep modules focused, avoid "god" utilities
- Dependency Inversion: depend on abstractions, not concrete details

## 4. Error Handling

- Throw `AppError` for known/expected failures
- Use `next(err)` to pass errors to the global error handler
- Avoid leaking sensitive error details in production
- Keep error messages user-friendly and consistent

## 5. Validation and Security

- Validate input at the route or controller boundary
- Never trust client-provided IDs or roles
- Sanitize strings used in queries
- Keep JWT secret and database credentials in environment variables
- Rate-limit sensitive endpoints (auth) when possible

## 6. Database and Mongoose

- Define Mongoose schemas in `src/models`
- Keep database access in `src/repositories`
- Prefer `lean()` for read-heavy queries when possible
- Avoid long-running queries in request lifecycle
- Use indexes for frequently queried fields

## 7. Auth and Authorization

- Use `authMiddleware` to protect private routes
- Keep JWT creation/verification in the auth repository/middleware
- Do not include sensitive user fields in responses
- Expire tokens and rotate secrets if compromised

## 8. Logging

- Use the global error handler for consistent logging
- Guard verbose logs with `NODE_DEBUG` or `NODE_ENV`
- Do not log secrets or tokens

## 9. Testing (When Added)

- Prefer unit tests for services and repositories
- Cover both success and error paths
- Use descriptive test names

## 10. Project Structure

- `controllers`: HTTP request/response handling
- `services`: business logic and orchestration
- `repositories`: database access and persistence
- `routes`: Express route definitions
- `middlewares`: request/response middleware
- `models`: Mongoose schemas
- `utils`: shared helpers and error types

## 11. Code Style

- 2-space indentation
- Keep lines readable; refactor long expressions
- Remove unused variables and dead code
- Prefer named exports in shared utils

## 12. API Conventions

- Use consistent response shapes: `{ data, error }` or `{ message, ... }`
- Use proper HTTP status codes for errors and validation
- Keep route naming consistent and pluralized (e.g., `/warehouse/items`)

## 13. Git Practices

- Write meaningful commit messages
- Keep PRs small and focused
- Avoid mixing refactors with feature changes

## 14. Environment Configuration

- Keep `.env` out of version control
- Document required variables in `documentation/project-docs.md`

Remember to follow these guidelines consistently to maintain quality and developer velocity.
