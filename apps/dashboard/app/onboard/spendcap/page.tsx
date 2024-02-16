"use client";

import { useRouter } from "next/navigation";
import { Text } from "@repo/ui";
import { useOrg } from "../../../lib/Organizations/OrganizationProvider";
import { UpdateOrgSpendCapForm } from "../../../lib/Organizations/UpdateOrganizationSpendCapForm";
import type { OrganizationId } from "../../../lib/Organizations/types";

export default function OnboardSpendCapPage() {
  const router = useRouter();
  const { org, isLoading } = useOrg();

  if (isLoading || !org) return null;

  return (
    <>
      <Text className="text-lg pb-4">
        What is your monthly spending cap? You can always change this later.
      </Text>
      <UpdateOrgSpendCapForm
        orgId={org._id as OrganizationId}
        onSuccess={() => {
          router.push(`/onboard/invites`);
        }}
      />
      <Text className="pt-6 text-center text-xs">Step 2 of 3</Text>
    </>
  );
}
