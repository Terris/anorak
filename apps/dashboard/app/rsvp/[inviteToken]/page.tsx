"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingScreen } from "@repo/ui";

export default function RsvpPage() {
  const router = useRouter();
  const { inviteToken } = useParams();

  useEffect(() => {
    router.replace(`/rsvp/${inviteToken as string}/questionaire`);
  }, [inviteToken, router]);

  return <LoadingScreen />;
}
