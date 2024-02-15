"use client";

import { OrganizationProvider } from "../../lib/Organizations/OrganizationProvider";
import { Text } from "@repo/ui";
import { Page } from "../../lib/layout/Page";

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Page>
      <div className="w-full my-8 mx-auto md:w-1/3 ">
        <Text as="h2" className="text-2xl font-tuna">
          We&rsquo;re so happy you&rsquo;re with us.
        </Text>
        <Text className="text-lg">
          Just a little housekeeping, and you&rsquo;ll be on your way to a more
          healthy workplace.
        </Text>
        <div className="my-8" />
        <OrganizationProvider>{children}</OrganizationProvider>
      </div>
    </Page>
  );
}
