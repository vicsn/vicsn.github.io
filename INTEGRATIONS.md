# Lunchclub for BWK — Production Integration Checklist

This document lists the integrations and production decisions that must replace the local test-mode adapters in the MVP.

## 1. BWK membership verification

**MVP:** Local JavaScript allow-list of demo email addresses.

**Production need:** Authoritative verification that the email belongs to an eligible paying BWK member or an approved test member.

Decide and test:
- Source system for BWK member status.
- Available API, scheduled export, SSO, or secure member-list synchronization.
- Canonical member identifier; do not rely only on email if addresses can change.
- Expiry / payment-state semantics.
- Synchronization frequency.
- What happens when a member is suspended or expires while they have an active match.
- How test members are approved and how the one-use restriction is enforced server-side.

## 2. Authentication and email confirmation

**MVP:** No password; session is stored in browser sessionStorage.

**Production need:** Secure authentication and confirmed email ownership.

Preferred options to evaluate:
- Existing BWK single sign-on, if available.
- Passwordless email magic links.
- Account system with MFA for administrators.

Must include:
- Email confirmation before profile activation.
- Session expiry and secure cookies.
- Rate limiting and abuse protection.
- Admin role enforcement on the server.
- Account recovery / email change process.

## 3. Hosted database

**MVP:** Browser localStorage.

**Production need:** Hosted relational database or comparable persistent service.

Suggested entities:
- users
- membership_status
- profiles
- goals
- availability_slots
- match_preferences
- matches
- match_participants
- date_options
- meeting_confirmations
- feedback
- email_events
- consent_records
- audit_events

Important constraints:
- Unique canonical member ID.
- A test member can consume at most one match.
- Prevent duplicate active matches.
- Preserve prior match history so repeated matches can be excluded.
- Soft-delete / retention rules must be defined with GDPR requirements.

## 4. Matching service

**MVP:** Matching runs in the browser.

**Production need:** Server-side matching job or service.

Current MVP logic:
1. Exclude inactive, incomplete, expired and exhausted test users.
2. Require exact group-size match.
3. Require at least one exact shared availability slot.
4. Require compatible language.
5. Exclude repeated pairings.
6. Prefer a younger / older pairing.
7. Add score for shared goals.
8. Add score for shared professional field.
9. Add a small score for different experience bands.

Before production:
- Confirm age bands and whether age collection is acceptable / necessary.
- Define what “young” and “old / established” mean as policy, not only code.
- Decide whether “new member” should be based on BWK join date rather than age.
- Define tie-breaking.
- Define behavior when no compatible match exists.
- Define quarterly frequency accounting.
- Decide whether admin approval is mandatory before introductions are sent.
- Add an auditable match explanation for administrators.

## 5. Transactional email

**MVP:** UI toast messages simulate email delivery.

**Production need:** Transactional email provider and verified sending domain.

Email events:
- Email confirmation / magic-link sign-in.
- Registration confirmation.
- Match introduction.
- Scheduling request.
- Date confirmed.
- Reminder(s).
- Follow-up / feedback request.
- Test-access completion and paid-membership conversion message.
- Match cancellation / replacement.

Must test:
- SPF, DKIM and DMARC.
- German and English templates.
- Retry and bounce handling.
- Unsubscribe distinction: service messages vs. optional marketing.
- Audit trail of sends without storing unnecessary message content.

## 6. Calendar and scheduling

**MVP:** Suggested dates are generated from shared static availability; confirmation is simulated.

**Production options:**
- Built-in scheduling with iCalendar invitations.
- Microsoft 365 / Google Calendar integration.
- External scheduling service.

Need to decide:
- Whether users enter recurring availability only or connect live calendars.
- Time-zone handling.
- Conflict checking.
- Who owns / hosts an online meeting link.
- What happens when participants reject all proposed times.
- Number of date options and reminders.
- Rescheduling and cancellation flow.

## 7. Profile images and uploads

**MVP:** The file input is present, but only the selected filename is stored.

**Production need:** Object storage or media service.

Must include:
- File-type and size validation.
- Malware / content scanning where appropriate.
- Image resizing.
- Access-control rules.
- Deletion when a user deletes the profile.

## 8. Admin console

**MVP:** Static browser UI; any knowledgeable user could inspect or alter it.

**Production need:** Authenticated server-backed admin application.

Admin actions to support:
- Verify or change membership state.
- Approve / revoke test access.
- View profiles according to an agreed privacy policy.
- Run or schedule matching.
- Approve, edit, cancel and manually create a match.
- Review failures and feedback.
- Export permitted operational data.
- Record an audit log for sensitive changes.

## 9. GDPR, legal and retention

**MVP:** Placeholder Privacy and Terms pages.

Before production launch, confirm:
- Data controller and contact details.
- Purpose and legal basis for each data category.
- Whether age is necessary or whether join date / career stage can achieve the same goal with less personal data.
- Exact profile data shared with matches.
- Consent wording and version history.
- Processors and data-processing agreements.
- Storage location / international transfers.
- Retention periods for inactive users, matches, feedback and email logs.
- Data access, correction, portability and deletion workflows.
- Incident response and breach procedures.

## 10. Hosting, observability and operations

Choose:
- Frontend hosting.
- Backend runtime.
- Database hosting.
- Secret management.
- CI/CD.
- Staging and production environments.

Add:
- Application logs without leaking sensitive profile data.
- Error monitoring.
- Health checks.
- Backup and recovery tests.
- Uptime monitoring.
- Security headers and CSP.
- Dependency and vulnerability scanning.

## 11. Accessibility and browser testing

Target an agreed accessibility level, preferably WCAG 2.2 AA unless BWK chooses another standard.

Test at minimum:
- Keyboard-only operation.
- Visible focus states.
- Screen-reader labels and form errors.
- Color contrast.
- Zoom to 200%.
- Current desktop and mobile versions of Chrome, Edge, Firefox and Safari.

## 12. Production acceptance tests

Before launch, perform end-to-end tests for:
1. Paying member registration and email confirmation.
2. Rejected non-member registration.
3. Approved test-member registration.
4. Test member receives exactly one match and is then deactivated.
5. Expired member is excluded from a new match.
6. Two-person matching with exact availability.
7. Three-person matching with exact shared availability.
8. No repeat pairing.
9. Admin edits / cancels / manually creates a match.
10. Match introduction email in German and English.
11. Successful date confirmation and calendar invite.
12. Reminder delivery.
13. Follow-up feedback submission.
14. User pauses and resumes matching.
15. User updates profile and matching uses the new values.
16. Account deletion and retention-policy verification.
17. Admin audit log.
18. Backup restore.
