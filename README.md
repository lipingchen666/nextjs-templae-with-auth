This is a [Next.js 13 app directory style](https://nextjs.org/) template bootstrapped with [typescript](), tailwindcss,
mongodb, and next-auth for authentication


## Getting Started
First, create .env.local and fill out the environment variable values listed in .env.example
```bash
cp ./.env.example ./.env.local
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

This templates uses nextAuth to set up authentication, and uses getServerSession in session.ts
to use in server components

### pages

There is two private pages, and one public page that demostrates authentication in action:
1. /finanical is private and redirects to login if user isn't logged in
2. /profile is private and redirects to login if user isn't logged in
3. /auth/signin is public and allows user to sign in, and if user is redrected from certain private pages,
it will redirect user back to that page after signing in via query param

## next auth

Next auth is set up by three files:

### lib/auth.ts

sets up the authOptions object, which is the config for authentication, such as 
1. functions to execute when certain actions happen, like when user sign up and we can save them to our database
2. jwt timeout, jwt's decode and encode method

### mongodb.ts

sets up the mongodb connection, which when used with auth adapter, next auth automatically saves to mongodb user's collection

### app/api/auth/[...nextauth]/route.ts

sets up the backend points for nextauth

### lib/session.ts

setsup getCurrentUser() to use in server components, which uses getServerSession


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
