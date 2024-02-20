"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationInviteContext } from "@repo/organizations/invites/context";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";
import { SignUpButton } from "@clerk/nextjs";

export default function RsvpPage() {
  const router = useRouter();

  const { me, isLoading: meIsLoading } = useMeContext();

  const { inviteToken } = useParams();
  const { invite, isLoading: inviteIsLoading } = useOrganizationInviteContext();
  const orgName = invite?.organization.name;

  useEffect(() => {
    if (meIsLoading || inviteIsLoading) return;
    if (me) {
      router.push(
        `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/rsvp/${inviteToken as string}`
      );
    } else if (!invite) {
      router.push("/");
    }
  }, [inviteToken, inviteIsLoading, router, invite, meIsLoading, me]);

  if (meIsLoading || inviteIsLoading) return <LoadingScreen />;

  return (
    <div className="w-full flex flex-col py-8 px-16 pb-64 mx-auto md:max-w-[1024px] md:flex-row md:gap-16 md:items-start md:justify-start">
      <div className="w-full md:w-3/5">
        <Text className="text-2xl font-tuna font-bold pb-2">
          Welcome to Anorak.
        </Text>
        <Text className="text-lg pb-8">
          We&rsquo;re overjoyed to have you here with us.
        </Text>

        <Text className="text-lg pb-4">
          <strong>{orgName}</strong> has invited you to join us.
        </Text>
      </div>
      <div className="w-full p-4 border md:mt-24 md:w-1/3 md:sticky md:top-4">
        <Text className="text-xl font-tuna font-bold pb-2">Ready up?</Text>
        <Text className="pb-4">Set up is quick and painless.</Text>
        <SignUpButton
          mode="modal"
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/rsvp/${
            inviteToken as string
          }/questionaire`}
        >
          <Button className="w-full">Let&rsquo;s get started!</Button>
        </SignUpButton>
      </div>
    </div>
  );
}
