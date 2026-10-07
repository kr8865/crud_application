# Frontend (Next.js)

A simple users CRUD page that talks to the NestJS REST API (MongoDB Atlas).

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                  # http://localhost:3000
```

Where to look:
- `src/lib/api.ts`: every call to the backend (`GET/POST/PATCH/DELETE /users`) using `fetch`
- `src/app/page.tsx`: the page with the form, the table, and the add/edit/delete logic
- `src/app/layout.tsx`: the HTML shell that wraps every page
