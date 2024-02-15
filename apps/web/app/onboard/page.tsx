"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Text } from "@repo/ui";
import { CreateOrganizationForm } from "../../lib/Organizations/CreateOrganizationForm";
import { useOrg } from "../../lib/Organizations/OrganizationProvider";

export default function OnboardOrgPage() {
  const router = useRouter();
  const { org, isLoading } = useOrg();

  useEffect(() => {
    if (isLoading) return;
    if (org) {
      router.push("/onboard/spendcap");
    }
  }, [isLoading, org, router]);

  if (isLoading) return null;

  return (
    <>
      <Text className="text-lg pb-4">Name your organization</Text>
      <CreateOrganizationForm
        onSuccess={(newOrgId) => router.push(`/onboard/spendcap`)}
      />
      <Text className="pt-6 text-center text-xs">Step 1 of 3</Text>
    </>
  );
}
