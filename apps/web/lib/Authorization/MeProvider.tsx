"use client";

import { createContext, ReactNode, useContext } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { Id } from "@repo/backend/convex/_generated/dataModel";
import { LoadingScreen } from "@repo/ui";

interface UserOrganization {
  id: Id<"organizations">;
  name: string;
  slug: string;
  isOwner: boolean;
}
interface User {
  id: Id<"users">;
  name: string;
  email: string;
  roles?: string[];
  isAuthorizedUser: boolean;
  orgUserId?: Id<"organizationUsers"> | null;
  organization?: UserOrganization | null;
}

interface MeContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  me: User | null | undefined;
  hasRole: (role: string) => boolean;
}

const initialProps = {
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isAuthorizedUser: false,
  me: null,
  hasRole: () => false,
};

export const MeContext = createContext<MeContextProps>(initialProps);

interface MeProviderProps {
  children: ReactNode;
}

export const MeProvider = ({ children }: MeProviderProps) => {
  // Authentication
  const { isLoading: authIsLoading, isAuthenticated } = useConvexAuth();

  const me = useQuery(api.me.sessionedMe);
  const meIsLoading = me === undefined;

  const isLoading = authIsLoading || meIsLoading;

  const hasRole = (role: string) => Boolean(me?.roles?.includes(role));

  return (
    <MeContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        me,
        hasRole,
      }}
    >
      {authIsLoading ? <LoadingScreen /> : children}
    </MeContext.Provider>
  );
};

export const useMe = () => {
  const meContext = useContext(MeContext);
  return meContext;
};