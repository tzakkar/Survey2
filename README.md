# Survey System

A complete production-ready survey system built with Next.js, TypeScript, Prisma, and PostgreSQL (Supabase). Supports multiple questionnaires with bilingual (English/Arabic) support and a full admin panel.

## Features

- ✅ **3 Questionnaire Types**: Staff, Manager & Above, and HR questionnaires
- ✅ **Bilingual Support**: English and Arabic (RTL) language support
- ✅ **Question Types**: Text, Multiple Choice, and Scale 1-5 questions
- ✅ **Admin Panel**: Full CRUD operations for questionnaires, questions, and options
- ✅ **Response Management**: View and manage survey responses
- ✅ **Public Survey Pages**: Clean, responsive survey forms with validation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma
- **Server Actions**: Next.js Server Actions for data mutations

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to the Supabase PostgreSQL database (credentials provided)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

**Important**: The `.env.example` file contains the database connection string. The password contains `&` which must be URL-encoded as `%26` in the connection string.

Your `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:6DLn.%26XkA9fgML8@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:6DLn.%26XkA9fgML8@db.sjjzoxcmtgzbyunnmopo.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

Generate Prisma Client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

This will create all necessary tables in your Supabase database.

### 4. Seed the Database

Populate the database with sample questionnaires and questions:

```bash
npm run db:seed
```

This will create:
- 3 questionnaires (Staff, Manager, HR)
- ~5 questions per questionnaire
- Bilingual content (English + Arabic)
- Options for multiple choice and scale questions

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── actions/          # Server actions
│   │   ├── admin.ts      # Admin CRUD operations
│   │   └── survey.ts     # Survey submission logic
│   ├── admin/            # Admin panel pages
│   │   ├── questionnaires/
│   │   └── questions/
│   ├── survey/           # Public survey pages
│   │   └── [slug]/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── LanguageSwitch.tsx
│   ├── SurveyForm.tsx
│   └── Admin*.tsx        # Admin components
├── lib/
│   ├── db.ts             # Prisma client
│   └── helpers/
│       └── i18n.ts       # Internationalization helpers
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/               # Static assets
```

## Usage

### Public Survey Pages

Visit a survey using its slug:

- Staff: `/survey/staff-questionnaire?lang=en`
- Manager: `/survey/manager-questionnaire?lang=en`
- HR: `/survey/hr-questionnaire?lang=en`

Add `?lang=ar` for Arabic version (RTL layout).

### Admin Panel

Access the admin panel at `/admin/questionnaires`

**Admin Features:**
- Create, edit, and delete questionnaires
- Manage questions (add, edit, delete, reorder)
- Add options for multiple choice and scale questions
- View survey responses
- Toggle questionnaire active/inactive status

## Database Schema

### Enums

- `AudienceType`: STAFF | MANAGER | HR
- `QuestionType`: TEXT | MULTIPLE_CHOICE | SCALE_1_5
- `Language`: EN | AR

### Tables

1. **Questionnaire**: Survey metadata
2. **Question**: Questions belonging to questionnaires
3. **Option**: Options for multiple choice/scale questions
4. **Response**: Survey submissions
5. **Answer**: Individual answers to questions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables in your hosting platform (Vercel, Railway, etc.)

3. Run migrations on production database:
   ```bash
   npx prisma migrate deploy
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Notes

- The database password contains `&` which must be URL-encoded as `%26` in connection strings
- Arabic pages automatically use RTL layout (`dir="rtl"`)
- All forms include client-side and server-side validation
- Server actions handle all data mutations for better security

## Troubleshooting

**Database Connection Issues:**
- Verify your `.env` file has the correct DATABASE_URL
- Ensure the password is properly URL-encoded (`%26` instead of `&`)
- Check that SSL mode is set to `require`

**Migration Issues:**
- Make sure Prisma Client is generated: `npm run db:generate`
- Check that the database is accessible from your network

**Build Issues:**
- Clear `.next` folder and rebuild
- Ensure all dependencies are installed: `npm install`

## License

This project is built for production use.
