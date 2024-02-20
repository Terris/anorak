import { cn } from "@repo/utils";
import { Toaster } from "@repo/ui";
import { Masthead } from "./Masthead";
import { AppProviders } from "./AppProviders";
import "./app.css";
import "@repo/ui/globals.css";

export const metadata = {
  title: "Anorak",
  description: "Live video business infrastructure.",
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
