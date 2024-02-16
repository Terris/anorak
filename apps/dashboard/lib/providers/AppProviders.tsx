"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { TooltipProvider } from "@repo/ui";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MeProvider } from "../Authorization/MeProvider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignInUrl={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "/dashboard"}
      afterSignUpUrl="/onboard"
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <MeProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <TooltipProvider>{children}</TooltipProvider>
          </NextThemesProvider>
        </MeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
