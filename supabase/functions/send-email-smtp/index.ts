// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import nodemailer from 'npm:nodemailer@6.9.10';
import { corsHeaders } from '../_shared/cors.ts'

const transport = nodemailer.createTransport({
  host: Deno.env.get('SMTP_HOSTNAME')!,
  port: Number(Deno.env.get('SMTP_PORT')!),
  secure: Deno.env.get('SMTP_SECURE') === 'true', // Make sure to compare string value
  auth: {
    user: Deno.env.get('SMTP_USERNAME')!,
    pass: Deno.env.get('SMTP_PASSWORD')!,
  },
});

console.log(`Function "send-email-smtp" up and running!`);
console.log(`SMTP_HOSTNAME: ${Deno.env.get('SMTP_HOSTNAME')}`);
console.log(`SMTP_PORT: ${Deno.env.get('SMTP_PORT')}`);
console.log(`SMTP_SECURE: ${Deno.env.get('SMTP_SECURE')}`);
console.log(`SMTP_USERNAME: ${Deno.env.get('SMTP_USERNAME')}`);
console.log(`SMTP_PASSWORD: ${Deno.env.get('SMTP_PASSWORD')}`);

Deno.serve(async (req) => {

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  if (req.method === 'POST') {
    try {
      // Parse the incoming request body as JSON
      const { to, subject, text, html } = await req.json();

      // Basic validation
      if (!to || !subject || (!text && !html)) {
        return new Response('Missing required fields', { status: 400 });
      }

      // Send email with dynamic data from the request body
      await new Promise<void>((resolve, reject) => {
        transport.sendMail(
          {
            from: Deno.env.get('SMTP_FROM')!, // Sender email
            to,                               // Dynamic recipient from POST request
            subject,                          // Dynamic subject from POST request
            text,                             // Dynamic plain text body
            html,                             // Dynamic HTML body (optional)
          },
          (error) => {
            if (error) {
              console.log(`Error sending email: ${error}`);
              return reject(error);
            }
            resolve();
          }
        );
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email sent successfully',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      console.log(`Error in send-email-smtp function: ${error}`);
      return new Response(error.message, { status: 500 });
    }
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
});


// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/send-email-smtp' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'