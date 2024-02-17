"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Text } from "@repo/ui";
import { CreateOrganizationForm } from "@repo/organizations";
import { useMeOrganizationContext } from "@repo/organizations/context";

export default function OnboardOrgPage() {
  const router = useRouter();
  const { meOrganization, isLoading } = useMeOrganizationContext();

  useEffect(() => {
    if (isLoading) return;
    if (meOrganization) {
      router.push("/onboard/spendcap");
    }
  }, [isLoading, meOrganization, router]);

  if (isLoading) return null;

  return (
    <>
      <Text className="text-lg pb-4">Name your organization</Text>
      <CreateOrganizationForm
        onSuccess={() => {
          router.push(`/onboard/spendcap`);
        }}
      />
      <Text className="pt-6 text-center text-xs">Step 1 of 3</Text>
    </>
  );
}
