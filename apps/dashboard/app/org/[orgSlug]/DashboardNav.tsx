import { useMeOrganizationContext } from "@repo/organizations/context";
import { Button, LoadingScreen } from "@repo/ui";
import { usePathname, useRouter } from "next/navigation";

export function DashboardNav() {
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
          router.push(`${meOrganizationPath}`);
        }}
        variant={pathname === `${meOrganizationPath}` ? "selected" : "ghost"}
        size="sm"
        className="justify-start"
      >
        Home
      </Button>
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}`);
        }}
        variant={
          pathname === `${meOrganizationPath}/appointments`
            ? "selected"
            : "ghost"
        }
        size="sm"
        className="justify-start"
      >
        Appointments
      </Button>
      <Button
        onClick={() => {
          router.push(`${meOrganizationPath}`);
        }}
        variant={
          pathname === `${meOrganizationPath}/messages` ? "selected" : "ghost"
        }
        size="sm"
        className="justify-start"
      >
        Messages
      </Button>
    </div>
  );
}
