"use client";

import { PrivatePageWrapper } from "@repo/auth";
import { MeOrganizationProvider } from "@repo/organizations/context";
import { type OrganizationDoc } from "@repo/organizations";
import { DashboardNav } from "./DashboardNav";

export default function OrgDashboardLayout({
  children,
}: {
  children: React.ReactNode;
  params: { myOrg: OrganizationDoc | undefined | null };
}) {
  return (
    <PrivatePageWrapper>
      <MeOrganizationProvider>
        <div className="w-full p-8 flex flex-col md:flex-row md:gap-16">
          <DashboardNav />
          <div className="w-5/6">{children}</div>
        </div>
      </MeOrganizationProvider>
    </PrivatePageWrapper>
  );
}
