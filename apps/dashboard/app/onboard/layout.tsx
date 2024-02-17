"use client";

import { Text } from "@repo/ui";
import { MeOrganizationProvider } from "@repo/organizations";

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 mx-auto md:w-[600px]">
      <Text as="h2" className="text-2xl font-tuna">
        We&rsquo;re so happy you&rsquo;re with us.
      </Text>
      <Text className="text-lg">
        Just a little housekeeping, and you&rsquo;ll be on your way to a more
        healthy workplace.
      </Text>
      <div className="my-8" />
      <MeOrganizationProvider>{children}</MeOrganizationProvider>
    </div>
  );
}
