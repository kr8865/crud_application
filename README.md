# Users CRUD: NestJS + MongoDB Atlas + Next.js

```
form/
├── backend/    NestJS REST API  -> http://localhost:4000
└── frontend/   Next.js page     -> http://localhost:3000
```

## How a request flows
1. **Browser (Next.js `page.tsx`)**: you click "Add". `createUser()` in `lib/api.ts` sends `POST http://localhost:4000/users` with JSON `{name, email, age}`.
2. **NestJS controller (`users.controller.ts`)**: `@Post()` receives it, and `ValidationPipe` checks the body against `CreateUserDto`. Bad data gets an automatic 400 response.
3. **NestJS service (`users.service.ts`)**: business logic, e.g. "is this email already used?" (if yes, 409). It calls the Mongoose model.
4. **Mongoose + MongoDB Atlas**: `userModel.create()` inserts a document into the `users` collection in your Atlas cluster.
5. The saved user (with its `_id`) is returned as JSON, and the page reloads the list.

## REST API
| Method | URL | Body | What it does |
|---|---|---|---|
| GET | /users | | list all users |
| GET | /users/:id | | one user (404 if missing) |
| POST | /users | `{ "name", "email", "age" }` | create |
| PATCH | /users/:id | any of `name`, `email`, `age` | update |
| DELETE | /users/:id | | delete |

`:id` is MongoDB's `_id`, e.g. `6650f1c2a1b2c3d4e5f60718`.

## Run it
**0. MongoDB Atlas**: under **Network Access**, add your current IP address. Then fill in `backend/.env` (see `.env.example`).

**1. Backend**
```bash
cd backend
npm install
npm run start:dev
```
**2. Frontend** (second terminal)
```bash
cd frontend
npm install
npm run dev              # open http://localhost:3000
```
You can see the data in Atlas under **Browse Collections → formdb → users**.
