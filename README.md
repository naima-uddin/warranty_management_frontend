# A2IT Warranty Management — Frontend (Next.js)

UI for issuing warranty cards, searching by Order ID / customer, printing the
warranty slip, and (for admins) managing moderators.
Stack: **Next.js 16 · React 19 · Tailwind v4**.

## Setup

```bash
npm install
cp .env.example .env    # NEXT_PUBLIC_API_URL -> your backend (default :5000)
npm run dev             # http://localhost:3000
```

Start the backend first (see `../warranty_managemnet_backend`), then log in with
the seeded admin account.

## Pages

- `/login` — sign in
- `/dashboard` — list & search warranties
- `/warranties/new` — issue a new warranty
- `/warranties/[id]` — warranty slip (Print / Edit / Delete)
- `/warranties/[id]/edit` — edit a warranty
- `/users` — manage moderators & permissions (admin only)

Buttons & nav items appear only if the logged-in user has the matching
permission. "Print slip" uses the browser print dialog — only the card prints.
