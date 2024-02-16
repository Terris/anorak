import { OrganizationInviteProvider } from "@repo/organizations/invites";

export default function RsvpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizationInviteProvider>{children}</OrganizationInviteProvider>;
}
