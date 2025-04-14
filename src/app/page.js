"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/schedule");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-8">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
          <Skeleton className="h-6 w-64 mx-auto" />
          <Skeleton className="h-10 w-40 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground animate-slide-in">
            <i>Welcome to</i>
          </h1>
          <div className="scale-120 animate-slide-in-right">
            <Logo />
          </div>
        </div>
        <p className="text-base text-muted-foreground animate-slide-in-delayed max-w-md mx-auto px-4">
          Schedule and join meetings with ease
        </p>
      </div>
      <Button asChild size="lg" className="lg:mt-2 mt-4 animate-slide-in-more-delayed gap-2 w-auto">
        <a href="/auth/signin" className="flex items-center justify-center gap-2">
          <LogIn className="h-5 w-5" />
          Try Sched
        </a>
      </Button>
    </div>
  );
}
