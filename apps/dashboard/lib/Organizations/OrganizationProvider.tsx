"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingScreen } from "@repo/ui";
import { useMe } from "../Authorization/MeProvider";
import type { OrganizationDoc } from "./types";

interface OrganizationContextProps {
  isLoading: boolean;
  org: OrganizationDoc | undefined | null;
}

const initialProps = {
  isLoading: true,
  org: undefined,
};

export const OrganizationContext =
  createContext<OrganizationContextProps>(initialProps);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const router = useRouter();
  const { me, isLoading } = useMe();

  const orgQueryArgs = me ? { userId: me.id } : "skip";
  const org = useQuery(api.organizations.sessionedFindByOwnerId, orgQueryArgs);
  const orgIsLoading = org === undefined;

  useEffect(() => {
    if (isLoading || orgIsLoading) return;
    if (!org) {
      router.replace("/");
    }
  }, [isLoading, org, orgIsLoading, router]);

  return (
    <OrganizationContext.Provider
      value={{
        isLoading,
        org,
      }}
    >
      {orgIsLoading || !org ? <LoadingScreen /> : children}
    </OrganizationContext.Provider>
  );
}

export const useOrg = () => {
  const organizationContext = useContext(OrganizationContext);
  return organizationContext;
};