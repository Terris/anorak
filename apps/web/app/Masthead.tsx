"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useMeContext } from "@repo/auth/context";
import { LogoDark, LogoLight, Text } from "@repo/ui";
import { ThemeModeToggle } from "@repo/ui/ThemeModeToggle";

export function Masthead() {
  const { resolvedTheme } = useTheme();
  const { isAuthenticated, me } = useMeContext();
  const path = usePathname();
  const isHomePath = path === "/";

  const hideHeader = [
    /^\/rsvp(?:\/.*)?$/, // /rsvp/[inviteToken]
  ].some((matcher) => matcher.test(path));

  if (hideHeader) return null;

  return (
    <div className="flex flex-row items-center justify-between w-full px-8 py-2 text-sm leading-none">
      <Link href="/" className=" flex flex-row items center mr-6">
        {resolvedTheme === "light" ? (
          <LogoDark width={100} />
        ) : (
          <LogoLight width={100} />
        )}
      </Link>

      {Boolean(isHomePath) && (
        <div className="flex flex-row items-center gap-8 mr-auto ml-4">
          <Link href="/" className="font-bold">
            How it works
          </Link>
          <Link href="/" className="font-bold">
            Pricing
          </Link>
          <Link href="/" className="font-bold">
            FAQs
          </Link>
          <SignUpButton mode="modal">
            <button type="button">
              <Text as="span" className="text-sm font-bold">
                Get Started
              </Text>
            </button>
          </SignUpButton>
        </div>
      )}
      {me?.isAuthorizedUser && me.organization?.slug ? (
        <div className="flex flex-row gap-8 ml-auto mr-8">
          <Link
            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/org/${me.organization.slug}`}
            className="font-bold"
          >
            Dashboard
          </Link>
        </div>
      ) : null}

      <div className="flex flex-row items-center justify-between gap-4">
        <ThemeModeToggle />
        {isAuthenticated ? (
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonPopoverCard: "rounded shadow-md",
              },
            }}
          />
        ) : (
          <SignInButton mode="modal" />
        )}
      </div>
    </div>
  );
}
