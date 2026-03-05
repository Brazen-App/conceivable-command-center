import mailchimp from "@mailchimp/mailchimp_marketing";

let configured = false;

/**
 * Returns a configured Mailchimp client.
 * Call this inside request handlers (not at module level) to ensure
 * env vars are available at runtime on Vercel.
 */
export function getClient() {
  if (!configured && process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_SERVER_PREFIX) {
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX,
    });
    configured = true;
  }
  return mailchimp;
}

export default getClient;
