import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface OrganizationInviteEmailProps {
  orgName: string;
  email: string;
  inviteLink: string;
}

export const OrganizationInviteEmail = ({
  orgName,
  email,
  inviteLink,
}: OrganizationInviteEmailProps) => {
  const previewText = `Join ${orgName} on Cyclical`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#fbf6f1] my-auto mx-auto font-sans px-2">
          <Container className="my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Text className="text-center">[Cyclical Logo]</Text>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>{orgName}</strong> on Cyclical!
            </Heading>
            <Text className="text-black text-[16px]">Hello {email},</Text>
            <Text className="text-black text-[16px]">
              <strong>{orgName}</strong> has invited you to the join them on
              Cyclical.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#586e5b] rounded text-white text-[16px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="text-black">{email}</span> and sent from{" "}
              <Link href="https://getcyclical.co">
                <span className="text-black">getcyclical.co</span>
              </Link>
              . If you were not expecting this invitation, you can ignore this
              email. If you are concerned about your account&rsquo;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OrganizationInviteEmail.PreviewProps = {
  orgName: "BittyBrella",
  email: "terris@bittybrella.com",
  inviteLink: "https://localhost:3000/invites/1234",
} as OrganizationInviteEmailProps;

export default OrganizationInviteEmail;
