export function welcomeEmail(firstName: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Welcome to Hotel Sircle, ${firstName}!</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Thank you for registering. Your membership application is now under review by our team.
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      We will notify you once your profile has been reviewed. In the meantime, please make sure your profile is complete with all relevant details.
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      If you have any questions, feel free to reach out to us at
      <a href="mailto:hello@hotelsircle.com" style="color:#4f46e5;">hello@hotelsircle.com</a>.
    </p>`;
}

export function membershipApproved(firstName: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Congratulations, ${firstName}!</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Your membership has been approved. Welcome to the Hotel Sircle network!
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      You now have full access to the platform, including the member directory, marketplace, events, and networking features.
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Log in to explore: <a href="https://hotelsircle.netlify.app" style="color:#4f46e5;">hotelsircle.netlify.app</a>
    </p>`;
}

export function membershipRejected(firstName: string, reason?: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Membership Update</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, unfortunately your membership application has not been approved at this time.
    </p>
    ${reason ? `
    <div style="background-color:#fef2f2; border-left:4px solid #ef4444; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#991b1b; font-size:14px; margin:0;"><strong>Reason:</strong> ${reason}</p>
    </div>` : ""}
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      If you believe this is an error or have questions, please contact us at
      <a href="mailto:hello@hotelsircle.com" style="color:#4f46e5;">hello@hotelsircle.com</a>.
    </p>`;
}

export function revisionRequested(
  firstName: string,
  flaggedFields: string[],
  adminNote: string
): string {
  const fieldList = flaggedFields
    .map((f) => `<li style="color:#4a4a68; font-size:14px; margin:4px 0;">${f}</li>`)
    .join("");

  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Profile Revision Requested</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, our team has reviewed your profile and is requesting some changes before approval.
    </p>
    <div style="background-color:#fffbeb; border-left:4px solid #f59e0b; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#92400e; font-size:14px; margin:0;"><strong>Admin Note:</strong> ${adminNote}</p>
    </div>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 8px;">
      <strong>Fields to update:</strong>
    </p>
    <ul style="margin:0 0 12px; padding-left:20px;">
      ${fieldList}
    </ul>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Please log in and update the flagged sections of your profile.
    </p>`;
}

export function profileApproved(firstName: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Profile Approved</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, your profile has been reviewed and approved. Welcome to the Hotel Sircle network!
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      You now have full access to the platform. Log in to explore:
      <a href="https://hotelsircle.netlify.app" style="color:#4f46e5;">hotelsircle.netlify.app</a>
    </p>`;
}

export function profileRejected(firstName: string, reason: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Profile Review Update</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, your profile has not been approved at this time.
    </p>
    <div style="background-color:#fef2f2; border-left:4px solid #ef4444; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#991b1b; font-size:14px; margin:0;"><strong>Reason:</strong> ${reason}</p>
    </div>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Please contact us at <a href="mailto:hello@hotelsircle.com" style="color:#4f46e5;">hello@hotelsircle.com</a> for more information.
    </p>`;
}

export function productApproved(firstName: string, productName: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Product Approved</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, your product <strong>"${productName}"</strong> has been approved and is now live on the marketplace.
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Members can now discover your product. Log in to manage your listings.
    </p>`;
}

export function productRejected(
  firstName: string,
  productName: string,
  note?: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Product Review Update</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, your product <strong>"${productName}"</strong> has not been approved.
    </p>
    ${note ? `
    <div style="background-color:#fef2f2; border-left:4px solid #ef4444; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#991b1b; font-size:14px; margin:0;"><strong>Note:</strong> ${note}</p>
    </div>` : ""}
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      You may update your product listing and resubmit for review.
    </p>`;
}

export function profileEditApproved(firstName: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Profile Update Approved</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Dear ${firstName}, your profile changes have been reviewed and approved. Your updated profile is now live.
    </p>`;
}

export function profileEditRejected(firstName: string, note?: string): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Profile Update Not Approved</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, your recent profile edit request was not approved. Your current profile remains unchanged.
    </p>
    ${note ? `
    <div style="background-color:#fef2f2; border-left:4px solid #ef4444; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#991b1b; font-size:14px; margin:0;"><strong>Note:</strong> ${note}</p>
    </div>` : ""}`;
}

export function eventRegistrationConfirmation(
  firstName: string,
  eventTitle: string,
  eventDate: string,
  venue?: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Registration Confirmed</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${firstName}, you have been successfully registered for:
    </p>
    <div style="background-color:#f0f9ff; border-left:4px solid #3b82f6; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#1e3a5f; font-size:15px; margin:0 0 4px;"><strong>${eventTitle}</strong></p>
      <p style="color:#1e3a5f; font-size:14px; margin:0 0 4px;">Date: ${eventDate}</p>
      ${venue ? `<p style="color:#1e3a5f; font-size:14px; margin:0;">Venue: ${venue}</p>` : ""}
    </div>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Your registration request has been received. We will notify you about seat availability and the further registration process shortly.
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      We look forward to seeing you there!
    </p>`;
}

export function connectionRequestReceived(
  receiverName: string,
  senderName: string,
  connectionType?: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">New Connection Request</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${receiverName}, <strong>${senderName}</strong> would like to connect with you${connectionType ? ` (${connectionType.toLowerCase().replace("_", " ")})` : ""}.
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Log in to view and respond to this request:
      <a href="https://hotelsircle.netlify.app" style="color:#4f46e5;">hotelsircle.netlify.app</a>
    </p>`;
}

export function connectionAccepted(
  senderName: string,
  accepterName: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Connection Accepted</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${senderName}, <strong>${accepterName}</strong> has accepted your connection request.
    </p>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      You can now message and collaborate. Log in to get started:
      <a href="https://hotelsircle.netlify.app" style="color:#4f46e5;">hotelsircle.netlify.app</a>
    </p>`;
}

export function postLiked(
  authorName: string,
  likerName: string,
  postTitle: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Someone liked your post</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${authorName}, <strong>${likerName}</strong> liked your post:
    </p>
    <div style="background-color:#f0f9ff; border-left:4px solid #3b82f6; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#1e3a5f; font-size:14px; margin:0;"><strong>${postTitle}</strong></p>
    </div>`;
}

export function postCommented(
  authorName: string,
  commenterName: string,
  postTitle: string,
  commentPreview: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">New comment on your post</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${authorName}, <strong>${commenterName}</strong> commented on your post "<strong>${postTitle}</strong>":
    </p>
    <div style="background-color:#f9f9fb; border-left:4px solid #8b5cf6; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#4a4a68; font-size:14px; margin:0; font-style:italic;">"${commentPreview}"</p>
    </div>`;
}

export function newMessageReceived(
  receiverName: string,
  senderName: string,
  messagePreview: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">New Message</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${receiverName}, you have a new message from <strong>${senderName}</strong>:
    </p>
    <div style="background-color:#f9f9fb; border-left:4px solid #10b981; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#4a4a68; font-size:14px; margin:0; font-style:italic;">"${messagePreview}"</p>
    </div>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Log in to reply: <a href="https://hotelsircle.netlify.app" style="color:#4f46e5;">hotelsircle.netlify.app</a>
    </p>`;
}

export function eventCreatedAdmin(
  eventTitle: string,
  creatorName: string,
  eventDate: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">New Event Created</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      A new event has been created by <strong>${creatorName}</strong>:
    </p>
    <div style="background-color:#f0f9ff; border-left:4px solid #3b82f6; padding:12px 16px; margin:0 0 12px; border-radius:0 4px 4px 0;">
      <p style="color:#1e3a5f; font-size:15px; margin:0 0 4px;"><strong>${eventTitle}</strong></p>
      <p style="color:#1e3a5f; font-size:14px; margin:0;">Date: ${eventDate}</p>
    </div>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      Review and manage this event in the admin panel.
    </p>`;
}

export function adminEventMessage(
  recipientName: string,
  eventTitle: string,
  adminMessage: string
): string {
  return `
    <h2 style="margin:0 0 16px; color:#1a1a2e; font-size:20px;">Update: ${eventTitle}</h2>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0 0 12px;">
      Dear ${recipientName},
    </p>
    <div style="background-color:#f9f9fb; border-left:4px solid #C6A962; padding:16px 20px; margin:0 0 16px; border-radius:0 4px 4px 0;">
      <p style="color:#0A1628; font-size:15px; line-height:1.7; margin:0; white-space:pre-wrap;">${adminMessage}</p>
    </div>
    <p style="color:#4a4a68; font-size:15px; line-height:1.6; margin:0;">
      For any queries, reach out to us at
      <a href="mailto:hello@hotelsircle.com" style="color:#4f46e5;">hello@hotelsircle.com</a>.
    </p>`;
}
