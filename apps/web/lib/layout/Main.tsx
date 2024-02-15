"use client";

import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
  privateRoute?: boolean;
}

export function Main({ children }: MainProps) {
  return (
    <main className="w-full flex flex-col items-start justify-start">
      {children}
    </main>
  );
}
