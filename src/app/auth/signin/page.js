"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[300px] lg:w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full cursor-pointer"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 