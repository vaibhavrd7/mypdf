# Privacy and GDPR launch review

The site now has privacy, cookie, terms, acceptable use, disclaimer, about, and contact pages linked in the shared footer. This is a code-based draft, not a determination that the service complies with GDPR or other privacy laws. The project does not contain enough operator or hosting information to publish a complete legal notice.

Before public launch, the site operator should:

1. The supplied operator name, Pune location, and email are now listed on `/privacy-policy`, `/terms-of-use`, `/about`, and `/contact`. Confirm the governing jurisdiction, whether a street-level postal address is required, and that the mailbox is monitored.
2. Confirm and document the lawful basis for each purpose, including requested file processing and temporary IP-based rate limiting.
3. Identify the deployed website/API providers, their roles, hosting regions, processor terms, any international transfers and safeguards, and actual access/security log retention.
4. Confirm the deployed application and hosting layers do not set cookies or add analytics, font, advertising, CAPTCHA, or monitoring scripts omitted from this source. Update the privacy and cookie policies if any are introduced.
5. Publish a process for receiving, verifying, and answering access, correction, erasure, restriction, portability, objection, and consent-withdrawal requests, plus the relevant supervisory authority information.
6. Reassess the notice whenever file retention, account features, analytics, contact forms, or PDF/image processing changes.

Current application facts reflected in the draft: there are no user accounts or database-backed file storage; image and supported PDF operations are sent to the API and processed in memory; the API rate limiter uses an in-memory IP key with a 15-minute window; browser object URLs are revoked when the result is cleared or the page is left; no analytics or advertising SDK is included in this codebase; and external Google Fonts requests were removed. The public brand is MyPDF; the existing deployment hostname remains imageforge.onrender.com until a new domain is configured.
