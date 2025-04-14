"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* <Image
        src="/logo.svg"
        alt="Sched Logo"
        width={32}
        height={32}
        className="h-8 w-auto"
        priority
      /> */}
      <Calendar className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold text-foreground">Sched</span>
    </div>
  );
} 