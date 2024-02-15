import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { buildOrganizationInviteEmailHTML } from "./lib/transactional";

const resend = new Resend(process.env.RESEND_API_KEY);

export const systemSendOrgInviteEmailToUser = internalAction({
  args: {
    toEmail: v.string(),
    orgName: v.string(),
    inviteToken: v.id("organizationInvites"),
  },
  handler: async (ctx, { toEmail, orgName, inviteToken }) => {
    const inviteLink = `${process.env.WEB_CLIENT_URL}/rsvp/${inviteToken}`;
    const inviteEmailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "invites@getcyclical.co",
      to: toEmail,
      subject: `Join ${orgName} on Cyclical`,
      html: buildOrganizationInviteEmailHTML({ toEmail, orgName, inviteLink }),
    });

    if (inviteEmailResponse.error) {
      throw new ConvexError(inviteEmailResponse.error.message);
    }

    return true;
  },
});
