"use client";

import { OrganizationInviteProvider } from "@repo/organizations/invites/context";

export default function RsvpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizationInviteProvider>{children}</OrganizationInviteProvider>;
}
