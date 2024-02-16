import { useQuery } from "convex/react";
import { api } from "@repo/convex";

export function useMeOrganizationFromSession() {
  const meOrganization = useQuery(
    api.organizations.sessionedFindByOrganizationUser
  );
  const isLoading = meOrganization === undefined;
  return { meOrganization, isLoading };
}
