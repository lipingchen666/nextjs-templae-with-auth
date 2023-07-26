import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcrypt-ts";
import clientPromise from "@/lib/mongodb";
// import { getUserByEmail } from "../../../lib/api/utils";

export const authOptions: NextAuthOptions  = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    // CredentialsProvider({
    //   // The name to display on the sign in form (e.g. "Sign in with...")
    //   name: "Credentials",
    //   // `credentials` is used to generate a form on the sign in page.
    //   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   // You can pass any HTML attribute to the <input> tag through the object.
    //   credentials: {},
    //   async authorize(credentials, req) {
    //     const { email, password } = credentials;
    //     console.log("credentials", credentials);
    //     const user = await getUserByEmail(email);
    //     console.log("user", user);
    //     if (!user) {
    //       throw new Error("wrong email");
    //     }
    //     const match = await bcrypt.compare(password, user.passwordHash || "");

    //     if (!match) {
    //       throw new Error("wrong password");
    //     }

    //     return user;
    //   }
    // })
  ],
  session: {
    strategy: "jwt"
  },
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/signin'
  }
}