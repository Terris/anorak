"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationInvite } from "@repo/organizations/invites";
import { LoadingScreen } from "@repo/ui";

export default function RsvpPage() {
  const router = useRouter();
  const { inviteToken } = useParams();
  const { invite, isLoading: inviteIsLoading } = useOrganizationInvite();

  useEffect(() => {
    if (inviteIsLoading) return;
    if (invite) {
      router.push(
        `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/rsvp/${inviteToken as string}`
      );
    } else {
      router.push("/");
    }
  }, [inviteToken, inviteIsLoading, router, invite]);

  if (inviteIsLoading) return <LoadingScreen />;

  return null;
}
