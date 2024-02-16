import { api } from "@repo/convex";
import { useQuery } from "convex/react";

export function useGetMeOrganization() {
  const meOrganization = useQuery(api.organizations.sessionedMeOrganization);
  const isLoading = meOrganization === undefined;

  return { isLoading, meOrganization };
}
