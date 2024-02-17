"use client";

import { useMeOrganizationContext } from "@repo/organizations/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { meOrganization, isLoading } = useMeOrganizationContext();

  useEffect(() => {
    if (isLoading) return;
    if (meOrganization) router.push(`/org/${meOrganization.slug}`);
  }, [isLoading, meOrganization, router]);

  return null;
}
