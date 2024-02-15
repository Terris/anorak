"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, LoadingScreen } from "@repo/ui";
import { PrivatePageWrapper } from "../../../../lib/Authorization/PrivatePageWrapper";
import { OrganizationDoc } from "../../../../lib/Organizations/types";
import {
  OrganizationProvider,
  useOrg,
} from "../../../../lib/Organizations/OrganizationProvider";
import { Page } from "../../../../lib/layout/Page";

export default function OrgDashboardLayout({
  children,
}: {
  children: React.ReactNode;
  params: { myOrg: OrganizationDoc | undefined | null };
}) {
  return (
    <PrivatePageWrapper>
      <OrganizationProvider>
        <Page className="flex flex-col gap-8 md:flex-row">
          <DashboardNav />
          <div className="w-5/6">{children}</div>
        </Page>
      </OrganizationProvider>
    </PrivatePageWrapper>
  );
}

function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, org } = useOrg();

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="w-1/6 flex flex-col">
      <Button
        onClick={() => router.push(`/${org?.slug}/admin`)}
        variant={pathname === `/org/${org?.slug}/admin` ? "selected" : "ghost"}
        className="justify-start"
      >
        {org!.name}
      </Button>
      <Button
        onClick={() => router.push(`/${org?.slug}/admin/users`)}
        variant={
          pathname === `/org/${org?.slug}/admin/users` ? "selected" : "ghost"
        }
        className="justify-start"
      >
        Users
      </Button>
      <Button
        onClick={() => router.push(`/${org?.slug}/admin/invites`)}
        variant={
          pathname === `/org/${org?.slug}/admin/invites` ? "selected" : "ghost"
        }
        className="justify-start"
      >
        Invites
      </Button>
      <Button
        onClick={() => router.push(`/${org?.slug}/admin/usage`)}
        variant={
          pathname === `/org/${org?.slug}/admin/usage` ? "selected" : "ghost"
        }
        className="justify-start"
      >
        Usage
      </Button>
      <Button
        onClick={() => router.push(`/${org?.slug}/admin/billing`)}
        variant={
          pathname === `/org/${org?.slug}/admin/billing` ? "selected" : "ghost"
        }
        className="justify-start"
      >
        Billing
      </Button>
    </div>
  );
}
