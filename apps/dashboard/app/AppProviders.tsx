"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthorizationProvider } from "@repo/auth/context";
import { MeOrganizationProvider } from "@repo/organizations/context";
import { TooltipProvider } from "@repo/ui";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthorizationProvider>
      <MeOrganizationProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TooltipProvider>{children}</TooltipProvider>
        </NextThemesProvider>
      </MeOrganizationProvider>
    </AuthorizationProvider>
  );
}
