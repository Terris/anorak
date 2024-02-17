"use client";

import { useRouter } from "next/navigation";
import { Text } from "@repo/ui";
import { useMeOrganizationContext } from "@repo/organizations/context";
import {
  UpdateOrgSpendCapForm,
  type OrganizationId,
} from "@repo/organizations";

export default function OnboardSpendCapPage() {
  const router = useRouter();
  const { meOrganization, isLoading } = useMeOrganizationContext();

  if (isLoading || !meOrganization) return null;

  return (
    <>
      <Text className="text-lg pb-4">
        What is your monthly spending cap? You can always change this later.
      </Text>
      <UpdateOrgSpendCapForm
        orgId={meOrganization._id as OrganizationId}
        onSuccess={() => {
          router.push(`/onboard/invites`);
        }}
      />
      <Text className="pt-6 text-center text-xs">Step 2 of 3</Text>
    </>
  );
}
