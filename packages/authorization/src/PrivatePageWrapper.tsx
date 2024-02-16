"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@repo/ui";
import { useMe } from "./MeProvider";

interface PrivatePageWrapperProps {
  children: React.ReactNode;
  authorizedRoles?: string[];
}

export function PrivatePageWrapper({
  children,
  authorizedRoles,
}: PrivatePageWrapperProps) {
  const router = useRouter();
  const { isLoading, me } = useMe();

  useEffect(() => {
    if (isLoading) return;
    if (!me?.isAuthorizedUser) {
      router.replace(`/`);
    }
  }, [isLoading, me?.isAuthorizedUser, router]);

  // Handle authorized roles
  useEffect(() => {
    if (isLoading || !authorizedRoles) return;
    if (
      Boolean(authorizedRoles) &&
      !authorizedRoles.every((role) => me?.roles?.includes(role))
    ) {
      router.push(`/`);
    }
  }, [router, isLoading, authorizedRoles, me?.roles]);

  const shouldShowLoading =
    isLoading ||
    (Boolean(authorizedRoles) &&
      !authorizedRoles?.every((role) => me?.roles?.includes(role)));

  if (shouldShowLoading) return <LoadingScreen />;
  return children;
}
