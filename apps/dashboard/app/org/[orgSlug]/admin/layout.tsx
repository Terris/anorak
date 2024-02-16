"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, LoadingScreen } from "@repo/ui";
import { PrivatePageWrapper } from "@repo/auth";
import {
  MeOrganizationProvider,
  useMeOrganization,
  type OrganizationDoc,
} from "@repo/organizations";

export default function OrgDashboardLayout({
  children,
}: {
  children: React.ReactNode;
  params: { myOrg: OrganizationDoc | undefined | null };
}) {
  return (
    <PrivatePageWrapper>
      <MeOrganizationProvider>
        <div className="w-full p-8 flex flex-col gap-8 md:flex-row">
          <DashboardNav />
          <div className="w-5/6">{children}</div>
        </div>
      </MeOrganizationProvider>
    </PrivatePageWrapper>
  );
}

function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, meOrganization } = useMeOrganization();

  const meOrganizationPath = meOrganization
    ? `/org/${meOrganization.slug}`
    : null;

  if (isLoading || !meOrganization) return <LoadingScreen />;
  return (
    <div className="w-1/6 flex flex-col">
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}/admin`);
        }}
        variant={
          pathname === `${meOrganizationPath}/admin` ? "selected" : "ghost"
        }
        className="justify-start"
      >
        {meOrganization.name}
      </Button>
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}/admin/users`);
        }}
        variant={
          pathname === `${meOrganizationPath}/admin/users`
            ? "selected"
            : "ghost"
        }
        className="justify-start"
      >
        Users
      </Button>
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}/admin/invites`);
        }}
        variant={
          pathname === `${meOrganizationPath}/admin/invites`
            ? "selected"
            : "ghost"
        }
        className="justify-start"
      >
        Invites
      </Button>
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}/admin/usage`);
        }}
        variant={
          pathname === `${meOrganizationPath}/admin/usage`
            ? "selected"
            : "ghost"
        }
        className="justify-start"
      >
        Usage
      </Button>
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}/admin/billing`);
        }}
        variant={
          pathname === `${meOrganizationPath}/admin/billing`
            ? "selected"
            : "ghost"
        }
        className="justify-start"
      >
        Billing
      </Button>
    </div>
  );
}
