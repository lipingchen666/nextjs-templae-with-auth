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

### setup jest

https://fek.io/blog/add-jest-testing-framework-to-an-existing-next-js-app/
1. npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
2. set up jest.config.js, example:
```
const nextJest = require('next/jest')
 
// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })
 
// Any custom config you want to pass to Jest
const customJestConfig = {
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
 
// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig)
```
3. the default jest test environment is nodejs, but you can change it in jest.config.js or as a docblock at the beginning of the test file:
```
/**
 * @jest-environment jsdom
 */
```
https://jestjs.io/docs/configuration#testenvironment-string

4. use in memory mongodb for testing, steps are 
    a. npm install --save-dev @shelf/jest-mongodb
    b. Specify preset in your Jest configuration:
    ```
    {
        "preset": "@shelf/jest-mongodb"
    }
    ```
    c. set up as shown in userDao.test.ts
    d. add jest.mongodb.config.js
    https://github.com/shelfio/jest-mongodb
    https://jestjs.io/docs/mongodb

### add jest

to add test there are three ways:
1. src/file.test.js mentioned first in the Getting Started docs, and is great for keeping tests (especially unit) easy to find next to source files
2. src/__tests__/file.js lets you have multiple __tests__ directories so tests are still near original files without cluttering the same directories
3. __tests__/file.js more like older test frameworks that put all the tests in a separate directory; while Jest does support it, it's not as easy to keep tests organized and discoverable

### run test

npm run test

### add firebase for real time - firestore
to add firebase:
1. create firebase.ts
    ```
    import { initializeApp } from 'firebase/app';
    import { getFirestore } from 'firebase/firestore';
    // Follow this pattern to import other Firebase services
    // import { } from 'firebase/<service>';

    // TODO: Replace the following with your app's Firebase project configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBVwX7fesAmWK4zIwI4nKDpcigdlf2ew-o",
        authDomain: "nextjs-template-chat-app.firebaseapp.com",
        projectId: "nextjs-template-chat-app",
        storageBucket: "nextjs-template-chat-app.appspot.com",
        messagingSenderId: "47307729756",
        appId: "1:47307729756:web:8a7907c42c2f9c89846f99",
        measurementId: "G-K99J6KQQ9H"
    };

    const app = initializeApp(firebaseConfig);
    const firebaseDb = getFirestore(app);

    export default firebaseDb
    ```
    note you shouldn't import from lite if you want realtime functionalities
2. and to set refs, firebase hooks, and query see ChatRoom.tsx
    refs: https://firebase.google.com/docs/firestore/data-model#web-modular-api_3
    hooks: https://github.com/CSFrequency/react-firebase-hooks/blob/master/firestore/README.md
    query to use limit and order and where and other filters: https://firebase.google.com/docs/firestore/query-data/order-limit-data#web-modular-api
    getData (actually calling refs):
    https://firebase.google.com/docs/firestore/query-data/get-data
    real time update without hooks:
    https://firebase.google.com/docs/firestore/query-data/listen
    data modelling: https://firebase.google.com/docs/firestore/data-model#web-modular-api_3
    overall tutorial: https://firebase.google.com/docs/firestore/quickstart



## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
