import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          scopes: ["profile", "email", "openid"],
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  session: {
    maxAge: 60 * 60 * 24,
  },
});

export { handler as GET, handler as POST };
