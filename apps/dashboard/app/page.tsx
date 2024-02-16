"use client";

import { useMeOrganization } from "@repo/organizations";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { meOrganization, isLoading } = useMeOrganization();

  useEffect(() => {
    if (isLoading) return;
    if (meOrganization) router.push(`/org/${meOrganization.slug}`);
  }, [isLoading, meOrganization, router]);

  return null;
}
