export const legalPages = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'Learn what information MyPDF processes, how image and PDF files are handled, how long data is kept, and how to exercise privacy rights.',
    updated: 'October 2, 2026',
    intro: 'This notice explains how MyPDF handles information when you browse the site or use its image and PDF tools. It describes the current application and should be checked against the production hosting setup before launch.',
    sections: [
      { title: 'Who is responsible for your information?', body: ['Data controller and operator: Vaibhav Deshmukh, operating MyPDF. Correspondence location: Pune, Maharashtra, India. A street-level postal address was not provided.', 'Privacy contact: deshmukhvaibhav7620@gmail.com. The operator should confirm whether a full postal address is required for the jurisdictions in which the service is offered.', 'The operator must confirm the actual hosting providers, transfer arrangements, and logging practices before public launch.'] },
      { title: 'Information the service processes', body: ['When you use most tools, your selected image or PDF files and the options you choose are sent to the MyPDF processing API. Images are checked and processed in server memory; supported PDF operations are parsed and returned in server memory. PDF to JPG is an exception: the selected PDF is rendered in your browser and is not uploaded to the MyPDF API. The application does not write uploaded or converted files to its own database or disk.', 'The API also receives the network information needed to handle a request, such as your IP address, request path, and request timing. Its in-memory rate limiter temporarily uses the IP address to limit abusive requests. The configured rate-limit window is 15 minutes; counters can also be cleared when the service restarts.', 'The application does not currently provide accounts, an email list, an analytics integration, advertising trackers, or a contact form. Do not upload documents or images containing information you do not want processed by the service.'] },
      { title: 'Why and on what basis information is processed', body: ['Image files and tool settings are processed to provide the conversion, compression, or resize that you request. For people in the EEA, the operator must confirm the appropriate GDPR legal basis for this service before launch; depending on the final service terms and implementation, providing a requested tool may be based on steps requested by you or the operator’s legitimate interests.', 'Network request information is used to operate, secure, and rate-limit the API. The operator should document the applicable legal basis and balance of interests for the real deployment. This site does not currently use personal data for advertising or analytics.'] },
      { title: 'Recipients and international transfers', body: ['The image processing API and the infrastructure provider that hosts the website or API may process request data to deliver the service. The operator must identify the actual provider(s), their roles, hosting region, and any transfer safeguards here before launch.', 'The current site code does not intentionally load analytics, advertising, or externally hosted fonts. Verify the production build and all deployment-level services before launch, since hosting, DNS, security, and monitoring providers may still receive connection data.'] },
      { title: 'How long information is kept', body: ['Uploaded and converted image data is handled in memory for the active request and is not intentionally saved by the MyPDF application. The browser keeps temporary preview and download object URLs while the page is open; those URLs are revoked when the selection is replaced or the page is left.', 'Rate-limit counters are held in server memory for the configured 15-minute window and are not a permanent user profile. Hosting and network providers may keep access or security logs under their own retention settings. The site operator must verify and publish the actual log retention period before launch.'] },
      { title: 'Your privacy rights', body: ['Depending on your location and the circumstances, you may have rights to request access to personal data, correction, erasure, restriction of processing, data portability, or to object to processing. Where processing relies on consent, you may withdraw it. These rights have legal limits and exceptions.', 'To make a request, contact the controller using the working privacy contact listed above. The operator may need enough information to verify the request and should respond within the period required by applicable law. You may also complain to your local data protection supervisory authority.'] },
      { title: 'Security and children', body: ['The API limits upload size, checks file contents, processes images in memory, and applies request rate limiting. No internet service can promise absolute security. The service is not designed for children and should not be used to submit sensitive images.'] },
      { title: 'Changes to this notice', body: ['This notice may change when the application, hosting, or applicable requirements change. The date at the top indicates when this page was last reviewed.'] },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'See how MyPDF uses cookies and similar technologies on the image and PDF tools.',
    updated: 'October 2, 2026',
    intro: 'MyPDF currently does not set cookies or use analytics, advertising, or cross-site tracking scripts. Tool filters and interface state are held in page memory and are cleared when the page reloads.',
    sections: [
      { title: 'Cookies used by MyPDF', body: ['The current application does not set first-party cookies for login, analytics, advertising, or preferences. The image processing API does not require an account or session cookie.', 'The current code does not load analytics, advertising, or externally hosted font scripts. Hosting and security services configured outside the application may still use their own technical cookies or logs; check the production provider settings before launch.'] },
      { title: 'Browser controls', body: ['You can use your browser settings to inspect or block cookies. Blocking cookies should not prevent the current image or PDF tools from working. If the site adds optional cookies or similar tracking in the future, this page and the consent controls will be updated before those technologies are enabled.'] },
      { title: 'Questions', body: ['For questions about cookies, contact deshmukhvaibhav7620@gmail.com. The operator must confirm whether hosting or security providers use cookies in production.'] },
    ],
  },
  'terms-of-use': {
    title: 'Terms of Use',
    description: 'Read the basic terms for using MyPDF online image conversion, compression, and resize tools.',
    updated: 'October 2, 2026',
    intro: 'These draft terms describe the current MyPDF image and PDF tools. The site operator must review them and add its legal identity and jurisdiction before public launch.',
    sections: [
      { title: 'Using the tools', body: ['MyPDF provides image conversion, compression, and resizing, along with PDF merging, page extraction and reordering, structural optimization, rotation, text watermarks, page numbering, cropping, typed signature text, image-to-PDF creation, and browser-based PDF-to-JPG rendering. You may use files you own or are authorized to process. You are responsible for keeping your originals and checking that the output meets your needs.', 'Image tools process one image per operation and support JPG, PNG, or WebP as required by the selected tool. PDF tools process up to 10 files at once for merge or image-to-PDF operations, and one PDF for other operations. Each selected file is limited to 15 MB, and a server-processed batch is limited to 40 MB total; server-side PDF operations support up to 250 pages and browser PDF-to-JPG supports up to 25 pages. Crop PDF changes the visible crop box without securely erasing hidden page content. Sign PDF adds typed text, not a certificate-backed digital signature. Available tools and limits may change.'] },
      { title: 'Your files and rights', body: ['You retain your rights in the files you submit. You authorize the service to process selected files only to return the output you request. Do not submit unlawful material or documents and images you are not allowed to process.'] },
      { title: 'Availability and liability', body: ['The tools are provided as-is and may be unavailable or produce results that need review. Keep a copy of important originals. Nothing in these terms limits rights or remedies that cannot legally be limited under the laws that apply to you.'] },
      { title: 'Operator details and applicable law', body: ['Operator: Vaibhav Deshmukh, MyPDF, Pune, Maharashtra, India. Contact: deshmukhvaibhav7620@gmail.com. Applicable law and any required street address should be confirmed for the jurisdictions in which the service is offered.'] },
    ],
  },
  'acceptable-use': {
    title: 'Acceptable Use Policy',
    description: 'Rules for using MyPDF image and PDF tools safely and lawfully.',
    updated: 'October 2, 2026',
    intro: 'Use MyPDF only for files you have the right to process and in ways allowed by applicable law.',
    sections: [
      { title: 'Permitted use', body: ['You may use the tools to convert and prepare your own files or files you are authorized to process. You remain responsible for your files and for checking the output before relying on it.'] },
      { title: 'Prohibited use', body: ['Do not use the service to violate another person’s rights, distribute unlawful material, upload malware, interfere with the service, evade its limits, or attempt unauthorized access to systems or data.', 'Do not use the service in a way that could damage, overload, or disrupt the site or other users’ access.'] },
      { title: 'Enforcement and reporting', body: ['The operator may restrict access where reasonably necessary to protect the service, users, or comply with law. Report suspected misuse to deshmukhvaibhav7620@gmail.com. The operator should ensure this mailbox is monitored.'] },
    ],
  },
  'disclaimer': {
    title: 'Disclaimer',
    description: 'Important information about MyPDF outputs, availability, and tool limitations.',
    updated: 'October 2, 2026',
    intro: 'MyPDF provides general file conversion and document preparation tools. Review the output and keep originals of important files.',
    sections: [
      { title: 'Output and accuracy', body: ['Conversion and compression can change appearance, quality, metadata, or file size. Results depend on the source file and settings; inspect each output before publishing, printing, submitting, or relying on it.', 'The crop PDF tool changes the visible page area and does not securely remove hidden content. The sign PDF tool places typed text and does not create a certificate-backed digital signature. PDF optimization may not reduce every file.'] },
      { title: 'Availability', body: ['The site may change, pause, or discontinue tools. Keep independent backups of files you need. The service is provided subject to the Terms of Use and applicable law.'] },
      { title: 'No professional advice', body: ['The tools and site information are not legal, financial, medical, or professional advice. Choose a qualified adviser when you need advice for a specific situation.'] },
    ],
  },
  'about': {
    title: 'About MyPDF',
    description: 'Learn about MyPDF, a collection of free online image and PDF tools.',
    updated: 'October 2, 2026',
    intro: 'MyPDF is a collection of browser-based image and PDF tools for everyday file tasks.',
    sections: [
      { title: 'What you can do', body: ['Convert, compress, and resize common image formats, and use PDF tools to merge, organize, rotate, watermark, number, crop, sign with typed text, create PDFs from images, and render PDF pages as JPGs.'] },
      { title: 'How processing works', body: ['Most selected files are sent to the processing API and handled temporarily in memory. PDF-to-JPG rendering happens in your browser. Read the Privacy Policy for the current implementation details and deployment limitations.'] },
      { title: 'Operator', body: ['MyPDF is operated by Vaibhav Deshmukh in Pune, Maharashtra, India. Contact: deshmukhvaibhav7620@gmail.com.'] },
    ],
  },
  'contact': {
    title: 'Contact MyPDF',
    description: 'Contact MyPDF about privacy requests, accessibility, or service issues.',
    updated: 'October 2, 2026',
    intro: 'Contact the MyPDF operator at the privacy and support email listed below. The operator should ensure the mailbox is monitored.',
    sections: [
      { title: 'General and privacy requests', body: ['Email: deshmukhvaibhav7620@gmail.com. Operator: Vaibhav Deshmukh, MyPDF. Address: Pune, Maharashtra, India. A street-level postal address was not provided.', 'Use this email to ask about personal data or exercise applicable rights. Do not send sensitive files by email unless the operator provides a safe and appropriate process.'] },
      { title: 'Before launch', body: ['Verify that this mailbox is monitored and confirm whether a full postal address and additional jurisdictional details are required. The site does not currently include a contact form.'] },
    ],
  },
};
