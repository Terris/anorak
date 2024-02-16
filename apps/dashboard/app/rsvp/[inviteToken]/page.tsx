"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { useMe } from "../../../lib/Authorization/MeProvider";
import { useOrganizationInvite } from "../../../lib/OrganizationInvites/OrganizationInviteProvider";
import { Page } from "../../../lib/layout/Page";

export default function RsvpPage() {
  const router = useRouter();
  const { inviteToken } = useParams();
  const { me, isLoading: meIsLoading } = useMe();
  const { invite, isLoading: inviteIsLoading } = useOrganizationInvite();
  const orgName = invite?.organization.name;

  useEffect(() => {
    if (meIsLoading) return;
    if (me) router.push(`/rsvp/${inviteToken as string}/questionaire`);
  }, [inviteToken, me, meIsLoading, router]);

  if (meIsLoading || inviteIsLoading) return <LoadingScreen />;

  return (
    <Page>
      <div className="w-full flex flex-col px-8 pb-64 mx-auto md:max-w-[1024px] md:flex-row md:gap-16 md:items-start md:justify-start">
        <div className="w-full md:w-3/5">
          <Text className="text-2xl font-tuna font-bold pb-2">
            Welcome to Cyclical.
          </Text>
          <Text className="text-lg pb-8">
            We&rsquo;re overjoyed to have you here with us.
          </Text>

          <Text className="text-lg pb-4">
            <strong>{orgName}</strong> has invited you to join us at Cyclical
            for mentorship and work therapy sessions. We&rsquo;re here to help
            you create a healthy work-life balance, achieve your professional
            goals, and get the absolute most out of your role at {orgName}.
          </Text>
          <Text className="text-lg pb-4">
            We&rsquo;ll explain more about what this means shortly. But first, a
            few things to keep in mind:
          </Text>
          <Text className="text-lg pb-4">
            <strong>Sessions and chats are confidential.</strong> With a few
            exceptions, anything you share in your sessions is strictly between
            you and your Cyclical mentor*.
          </Text>

          <Text className="text-lg pb-4">
            <strong>Our mentors are also licenced therapists.</strong> While our
            primary focus here is workplace wellness and professional
            development, our mentors are also available to help you with
            personal struggles should you choose to share them.
          </Text>
          <Text className="text-lg pb-4">
            <strong>You are under no obligation to participate.</strong> Though
            we encourage you to try a few sessions, you&rsquo;re not—and never
            will be—required to engage in our sessions.
          </Text>
          <Text className="text-lg pb-4">
            <strong>
              {orgName} is covering 100% of the cost of your sessions.
            </strong>{" "}
            {orgName} is offering this benefit to you because it&rsquo;s
            committed to providing workplace wellness and the support you need
            to reach your professional goals. They even{" "}
            <Link href="#" className="underline">
              signed a pledge
            </Link>
            .
          </Text>
          <Text className="text-lg pb-8">
            <strong>We&rsquo;re here to help.</strong> Should you have any
            questions about Cyclical or our sessions, our success team is
            available. Visit our contact page for ways to get in touch.
          </Text>

          <Text className="text-sm">
            * In the United States, mental health professionals are obligated to
            break patient/therapist confidentiality if there is an imminent risk
            of harm to the patient or others, suspicion of child or elder abuse,
            or upon receipt of a court order.
          </Text>
        </div>
        <div className="w-full p-4 border md:mt-24 md:w-1/3 md:sticky md:top-4">
          <Text className="text-xl font-tuna font-bold pb-2">Ready up?</Text>
          <Text className="pb-4">Set up is quick and painless.</Text>
          <SignUpButton
            mode="modal"
            afterSignUpUrl={`/rsvp/${inviteToken as string}/questionaire`}
          >
            <Button className="w-full">Let&rsquo;s get started!</Button>
          </SignUpButton>
        </div>
      </div>
    </Page>
  );
}
