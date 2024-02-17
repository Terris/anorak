"use client";

import { useState } from "react";
import { Button, Input, LoadingScreen, LogoDark, Text } from "@repo/ui";
import { useOrganizationInviteContext } from "@repo/organizations/invites/context";

export default function RsvpProfilePage() {
  const {
    isLoading: inviteIsLoading,
    completeOnboarding,
    isMutating,
  } = useOrganizationInviteContext();
  const [step, setStep] = useState(0);

  function handleNextStep() {
    setStep((prev) => prev + 1);
  }

  if (inviteIsLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 flex flex-col py-16 mx-auto max-w-[600px]">
      <div className="pb-8">
        <LogoDark width={60} />
      </div>

      <Text className="text-2xl font-tuna font-bold pb-2">
        Let&rsquo;s learn a little about you.
      </Text>
      <Text className="text-lg pb-8">
        This information is private and won&rsquo;t be shared with your company
        or anyone else. We use this information to help match you with the best
        mentor for your needs.
      </Text>

      <hr className="mb-8" />

      {step === 0 && (
        <>
          <Text className="font-bold pb-8">
            Have you ever seen a mental health professional before?
          </Text>
          <Input placeholder="Your answer..." className="mb-4" />
        </>
      )}

      {step === 1 && (
        <>
          <Text className="font-bold pb-8">
            Approximately how long have you been with your current employer?
          </Text>
          <Input placeholder="Your answer..." className="mb-4" />
        </>
      )}

      {step === 2 && (
        <>
          <Text className="font-bold pb-8">
            How many years have you been working?
          </Text>
          <Input placeholder="Your answer..." className="mb-4" />
        </>
      )}

      <div className="flex flex-row items-center justify-end gap-8 pb-16">
        <Button className="w-1/2" disabled={step === 0} variant="outline">
          Back
        </Button>
        {step === 2 ? (
          <Button
            className="w-1/2"
            onClick={() => {
              completeOnboarding();
            }}
            disabled={isMutating}
          >
            Finish
          </Button>
        ) : (
          <Button
            className="w-1/2"
            onClick={handleNextStep}
            disabled={isMutating}
          >
            Next
          </Button>
        )}
      </div>
      <Text className="text-center text-muted-foreground text-sm">
        Step {step + 1} of 2
      </Text>
    </div>
  );
}
