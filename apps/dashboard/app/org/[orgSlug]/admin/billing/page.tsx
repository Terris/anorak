"use client";
import { LoadingBox, Text } from "@repo/ui";
import { useMeOrganizationContext } from "@repo/organizations/context";
import { QuickCreateOrganizationPaymentMethodForm } from "./QuickCreateOrganizationPaymentMethodForm";

export default function DashboardPage() {
  const { isLoading, meOrganization } = useMeOrganizationContext();
  if (isLoading || !meOrganization) return <LoadingBox />;

  return (
    <div>
      <div className="flex flex-row items-center justify-between pb-4">
        <Text as="h2" className="text-2xl">
          Billing
        </Text>
        <QuickCreateOrganizationPaymentMethodForm />
      </div>
      <div className="flex flex-row items-center justify-between pb-4">
        <Text as="h3" className="">
          Payment Methods
        </Text>
      </div>
      [list payment methods]
    </div>
  );
}
