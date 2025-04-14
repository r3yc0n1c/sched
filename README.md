
<div align="center">
   <div style="display: flex;">
   <img src="./public/logo.svg" />
   <h1>Sched</h1>
   </div>
   A simple web application that allows users to authenticate via Google SSO and create/schedule Google Meet meetings.
</div>

## Demo

<div align="center">
  <video src="https://github.com/user-attachments/assets/9144362c-91d4-4878-8878-263b69337223" />
</div>




## Features

- Google SSO authentication using NextAuth.js
- Instant meeting creation with Google Meet links
- Scheduled meeting creation with future date/time
- Clean and intuitive user interface

## Prerequisites

- Bun v1.2.9
- Google Cloud Platform account
- Google OAuth 2.0 credentials

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/r3yc0n1c/sched.git
   cd sched
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CLIENT_AUTH_URI=your-google-client-auth-uri
   GOOGLE_CLIENT_TOKEN_URI=your-google-client-token-uri
   GOOGLE_CLIENT_PROJECT_ID=your-google-client-project-id
   GOOGLE_CLIENT_REDIRECT_URIS=your-google-client-redirect-uris
   GOOGLE_CLIENT_JAVASCRIPT_ORIGINS=your-google-client-js-origins-uris
   ```

4. Set up Google OAuth credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000` (for development)
   - Copy the Client ID and Client Secret to your `.env.local` file

5. Run the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser


## License

MIT
