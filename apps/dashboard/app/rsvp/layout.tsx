import { OrganizationInviteProvider } from "../../lib/OrganizationInvites/OrganizationInviteProvider";

export default function RsvpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizationInviteProvider>{children}</OrganizationInviteProvider>;
}
