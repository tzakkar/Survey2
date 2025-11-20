# Quick Start: Reconnect Database

## 🚀 Fast Track (5 minutes)

### 1. Get Connection Info from Supabase
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **Database**
4. Copy the **Connection string (URI)**
5. Go to: **Settings** → **API**
6. Copy: **Project URL**, **anon key**, **service_role key**

### 2. Update `.env` File
Open `.env` in your project root and update:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_KEY="your_service_role_key"
```

**Important:** 
- Replace `YOUR_PASSWORD` with actual password
- URL-encode special characters: `&` → `%26`, `@` → `%40`
- Replace `PROJECT_REF` with your project reference

### 3. Test Connection
```bash
npm run db:test-simple
```

### 4. Push Schema (if needed)
```bash
npm run db:push
```

### 5. Regenerate Prisma Client
```bash
npm run db:generate
```

### 6. Test Again
```bash
npm run dev
```

Visit: http://localhost:3000/admin/questionnaires

---

## 📚 Full Guide
See `DATABASE_RECONNECTION_GUIDE.md` for detailed instructions.

