import { Toaster } from "@repo/ui";
import { cn } from "@repo/utils";
import "./app.css";
import "@repo/ui/globals.css";
import AppProviders from "./AppProviders";
import { Masthead } from "./Masthead";

export const metadata = {
  title: "Cyclical",
  description: "Work therapy and mentorship sessions.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/crw6lsz.css" />
      </head>
      <body className={cn("min-h-screen antialiased font-halcom")}>
        <AppProviders>
          <div className="flex flex-col w-full h-full min-h-screen flex-1">
            <Masthead />
            <main className="w-full flex flex-col items-start justify-start">
              {children}
            </main>
            {modal}
            <Toaster />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
