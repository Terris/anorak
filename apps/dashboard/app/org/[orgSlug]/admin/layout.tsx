"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button, LoadingScreen } from "@repo/ui";
import { useMeOrganizationContext } from "@repo/organizations/context";
import { type OrganizationDoc } from "@repo/organizations";
import { useEffect } from "react";

export default function OrgDashboardLayout({
  children,
}: {
  children: React.ReactNode;
  params: { myOrg: OrganizationDoc | undefined | null };
}) {
  const router = useRouter();
  const { meOrganization, isLoading } = useMeOrganizationContext();

  useEffect(() => {
    if (isLoading || !meOrganization) return;
    if (!meOrganization.meIsOwner) {
      router.replace(`/org/${meOrganization.slug}`);
    }
  }, [isLoading, meOrganization, router]);

  if (isLoading || !meOrganization) return <LoadingScreen />;

  return (
    <div className="w-full p-8 flex flex-col md:flex-row md:gap-16">
      <AdminDashboardNav />
      <div className="w-5/6">{children}</div>
    </div>
  );
}

function AdminDashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, meOrganization } = useMeOrganizationContext();

  const meOrganizationPath = meOrganization
    ? `/org/${meOrganization.slug}`
    : null;

  if (isLoading || !meOrganization) return <LoadingScreen />;
  return (
    <div className="flex flex-col gap-1 md:w-1/6 ">
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}/admin`);
        }}
        variant={
          pathname === `${meOrganizationPath}/admin` ? "selected" : "ghost"
        }
        size="sm"
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
        size="sm"
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
        size="sm"
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
        size="sm"
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
        size="sm"
        className="justify-start"
      >
        Billing
      </Button>
    </div>
  );
}
