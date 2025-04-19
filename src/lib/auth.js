import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { google } from "googleapis";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        
        // Create and store OAuth2Client instance
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );
        
        oauth2Client.setCredentials({
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          token_type: 'Bearer',
          scope: account.scope,
        });
        
        token.oauth2Client = oauth2Client;
        
        // console.log("New tokens and OAuth2Client received:");
        // console.log("Access Token:", account.access_token);
        // console.log("Refresh Token:", account.refresh_token);
        // console.log("OAuth2Client configured:", !!oauth2Client);
        // console.log("Account:", account);
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.oauth2Client = token.oauth2Client;
      
      // console.log("Session created with tokens and OAuth2Client:");
      // console.log("Access Token:", token.accessToken);
      // console.log("Refresh Token:", token.refreshToken);
      // console.log("OAuth2Client available:", !!token.oauth2Client);

      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 