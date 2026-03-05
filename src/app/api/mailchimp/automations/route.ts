import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

/**
 * GET /api/mailchimp/automations
 * Lists all automations (classic automations / customer journeys).
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    const response = await mc.automations.list({ count: 50 });
    const automations = (response?.automations || []).map((a: Record<string, unknown>) => ({
      id: a.id,
      title: (a.settings as Record<string, unknown>)?.title,
      status: a.status,
      emailsSent: a.emails_sent,
      startTime: a.start_time,
      createTime: a.create_time,
      triggerSettings: a.trigger_settings,
    }));

    return NextResponse.json({ automations });
  } catch (err) {
    console.error("GET automations error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch automations" },
      { status: 500 }
    );
  }
}

// Template data for email flows
const ABANDONED_CART_FLOW = {
  name: "Abandoned Cart Recovery",
  emails: [
    {
      delay: "2 hours",
      subject: "Quick — your items are waiting",
      preview: "Complete your order and get free shipping",
      body: `Hi {{fname}},

Looks like you left some items in your cart! We've saved them for you.

Your Cart:
{{cart_items}}

{{#if cart_total > 50}}
Good news — your order qualifies for FREE shipping!
{{/if}}

[Complete Your Order →]

Questions? Reply to this email and our team will help.

Warm regards,
Kirsten & the Conceivable Team`,
      offer: "Free shipping on orders over $50",
    },
    {
      delay: "24 hours",
      subject: "We saved your cart for you",
      preview: "Here's 10% off to complete your order",
      body: `Hi {{fname}},

Still thinking it over? We get it — choosing the right fertility support is important.

Here's what other women are saying:
⭐⭐⭐⭐⭐ "I noticed changes within the first month. The data tracking alone was worth it."

Your cart is still waiting, and we'd love to help you get started:

Use code READY10 for 10% off your order.

[Complete Your Order with 10% Off →]

This code expires in 48 hours.

With care,
Kirsten & the Conceivable Team`,
      offer: "10% off with code READY10",
    },
    {
      delay: "48 hours",
      subject: "Your cart expires in 24 hours",
      preview: "Last chance — 15% off before your cart is cleared",
      body: `Hi {{fname}},

This is your last chance — your saved cart will expire in 24 hours.

We're offering our best discount to help you take the first step:

Use code LASTCHANCE15 for 15% off your entire order.

Plus free shipping on orders over $50.

Why women choose Conceivable:
✓ 150-260% improvement in fertility markers (pilot data)
✓ AI-powered personalized recommendations
✓ Track 8+ biomarkers that matter
✓ Expert-designed supplement protocols

[Save 15% — Complete Your Order →]

After tomorrow, we'll clear your cart and this offer expires.

Rooting for you,
Kirsten & the Conceivable Team`,
      offer: "15% off with code LASTCHANCE15",
    },
  ],
};

const POST_PURCHASE_FLOW = {
  name: "Post-Purchase Onboarding",
  emails: [
    {
      delay: "immediate",
      subject: "Welcome to your fertility journey 💜",
      preview: "Here's how to get the most from Conceivable",
      body: `Hi {{fname}},

Welcome to Conceivable! You've just taken an incredible step in your fertility journey.

Here's what happens next:
1. Download the app (if you haven't already)
2. Complete your initial health profile
3. Start tracking your daily biomarkers

Your order is being prepared and will ship within 24 hours.

Quick Start Guide:
→ Set up daily tracking reminders
→ Log your BBT first thing each morning
→ Complete your supplement schedule

Need help getting started? Reply to this email — we're here for you.

Warmly,
Kirsten`,
    },
    {
      delay: "2 days",
      subject: "Day 2: Getting the most from your supplements",
      preview: "Quick tips for optimal absorption and timing",
      body: `Hi {{fname}},

By now you should have received your order (or it's on the way!).

Here are the timing tips that make the biggest difference:

Morning (with breakfast):
→ Prenatal multivitamin
→ CoQ10

Evening (with dinner):
→ Omega-3
→ Vitamin D

Pro tips:
• Take with food for better absorption
• Set a daily alarm so it becomes a habit
• Store in a cool, dry place

Tracking tip: Log your supplement intake in the app to see how consistency correlates with your biomarker improvements.

You've got this!
Kirsten`,
    },
    {
      delay: "7 days",
      subject: "One week in — here's what to look for",
      preview: "Your first week of data tells an important story",
      body: `Hi {{fname}},

It's been a week since you started! Here's what your early data might be showing:

What's normal in Week 1:
✓ BBT fluctuations as you establish a baseline
✓ Learning your body's unique patterns
✓ Some biomarkers may not change immediately

What to focus on:
→ Consistency is more important than perfection
→ Look for TRENDS, not individual data points
→ The AI needs 7-14 days of data to start making personalized recommendations

Join our community:
Connect with other women on the same journey. Share tips, ask questions, and celebrate wins together.

[Join the Community →]

Keep going — the data gets more powerful every day.

Kirsten`,
    },
    {
      delay: "14 days",
      subject: "How's it going? We'd love your feedback",
      preview: "Quick check-in + we'd appreciate a review",
      body: `Hi {{fname}},

Two weeks in! By now, our AI should be starting to give you personalized insights.

How are you finding the experience so far?

We'd love to hear from you — your feedback helps us improve for everyone:

[Leave a Review →]

If anything isn't working right or you have questions, please don't hesitate to reach out. We read every message.

Keep tracking, keep learning, keep growing.

With gratitude,
Kirsten`,
    },
    {
      delay: "60 days",
      subject: "Time to reorder? Here's a reminder",
      preview: "Don't let your supplement routine break — reorder today",
      body: `Hi {{fname}},

If you've been taking your supplements daily, you're probably running low right about now.

Don't break your streak! Consistency is one of the biggest predictors of success.

Your results so far:
→ Check your app for your personalized progress report
→ Look at The Gain — how far you've come from your starting point

[Reorder Now →]

Continuing members save 15% on subscription orders.

Here's to continued progress,
Kirsten`,
    },
  ],
};

const POST_APP_DOWNLOAD_FLOW = {
  name: "Post-App Download Onboarding",
  emails: [
    {
      delay: "immediate",
      subject: "You're in! Here's how to get started with Conceivable",
      preview: "3 things to do in your first 5 minutes",
      body: `Hi {{fname}},

Welcome to the Conceivable app! Let's get you set up for success.

First 5 minutes — do these 3 things:

1️⃣ Complete your health profile
The more we know, the better our AI recommendations. It takes about 3 minutes.

2️⃣ Set up daily tracking reminders
Consistency is key. We recommend setting reminders for:
• Morning: BBT + HRV
• Evening: Supplements + daily log

3️⃣ Connect your wearable (if you have one)
Oura, Apple Watch, or Fitbit data flows directly into your dashboard.

[Open the App →]

Quick tip: The app works best when you track daily. Even partial data is valuable!

Excited you're here,
Kirsten`,
    },
    {
      delay: "3 days",
      subject: "Day 3: Features you might have missed",
      preview: "These hidden gems make all the difference",
      body: `Hi {{fname}},

You've been using Conceivable for a few days now. Here are some features that many users miss but love once they find them:

🔍 Correlation View
See how your sleep, stress, and nutrition correlate with your cycle data. Go to Dashboard → Correlations.

📊 Weekly Insights
Every Monday, your AI coach generates a personalized summary. Check the Insights tab.

💬 Community Q&A
Have a question about your data? Our community of women and experts is there to help.

📱 Widget Setup
Add the Conceivable widget to your home screen for one-tap daily logging.

[Explore These Features →]

The more you engage with the app, the smarter it gets.

Kirsten`,
    },
    {
      delay: "7 days",
      subject: "One week of tracking — here's your first milestone",
      preview: "Your AI coach has its first insights for you",
      body: `Hi {{fname}},

One week of data! This is a real milestone.

At this point, your AI coach should have enough data to start showing you:
→ Your initial biomarker baselines
→ Early pattern recognition
→ Your first personalized recommendations

What to do now:
1. Check your Dashboard for your first AI insights
2. Review your tracking consistency score
3. Set a goal for Week 2

If you haven't started supplements yet:
Our supplement protocols are designed to work with the data you're already tracking. See what your AI recommends.

[See Your Week 1 Insights →]

You're building something powerful — a complete picture of your fertility health.

Keep going!
Kirsten`,
    },
  ],
};

const NEWSLETTER_TEMPLATE = {
  name: "Friday Fertility Insights",
  structure: `
<!-- Friday Fertility Insights Newsletter Template -->
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;font-family:Inter,Arial,sans-serif;">
  <!-- Header -->
  <tr>
    <td style="background-color:#5A6FFF;padding:32px;text-align:center;">
      <img src="{{logo_url}}" alt="Conceivable" width="140" />
      <p style="color:#ACB7FF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:12px 0 0;">Friday Fertility Insights</p>
    </td>
  </tr>

  <!-- Hero Article -->
  <tr>
    <td style="padding:32px;background-color:#F9F7F0;">
      <img src="{{hero_image}}" alt="" width="100%" style="border-radius:12px;margin-bottom:16px;" />
      <h1 style="font-size:22px;color:#2A2828;margin:0 0 8px;">{{hero_title}}</h1>
      <p style="font-size:14px;color:#666;line-height:1.6;margin:0 0 16px;">{{hero_excerpt}}</p>
      <a href="{{hero_link}}" style="display:inline-block;background-color:#5A6FFF;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Read More</a>
    </td>
  </tr>

  <!-- 3-Column Section -->
  <tr>
    <td style="padding:24px 32px;background-color:white;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33%" style="padding:8px;vertical-align:top;">
            <p style="font-size:10px;color:#5A6FFF;text-transform:uppercase;font-weight:600;margin:0 0 4px;">Quick Tip</p>
            <p style="font-size:13px;color:#2A2828;margin:0;">{{tip_content}}</p>
          </td>
          <td width="33%" style="padding:8px;vertical-align:top;">
            <p style="font-size:10px;color:#78C3BF;text-transform:uppercase;font-weight:600;margin:0 0 4px;">New Research</p>
            <p style="font-size:13px;color:#2A2828;margin:0;">{{research_content}}</p>
          </td>
          <td width="33%" style="padding:8px;vertical-align:top;">
            <p style="font-size:10px;color:#E37FB1;text-transform:uppercase;font-weight:600;margin:0 0 4px;">Community Highlight</p>
            <p style="font-size:13px;color:#2A2828;margin:0;">{{community_content}}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Product Spotlight -->
  <tr>
    <td style="padding:24px 32px;background-color:#F9F7F0;">
      <p style="font-size:10px;color:#9686B9;text-transform:uppercase;font-weight:600;margin:0 0 8px;">Product Spotlight</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="80" style="vertical-align:top;">
            <img src="{{product_image}}" alt="" width="80" style="border-radius:8px;" />
          </td>
          <td style="padding-left:16px;vertical-align:top;">
            <h3 style="font-size:16px;color:#2A2828;margin:0 0 4px;">{{product_name}}</h3>
            <p style="font-size:13px;color:#666;margin:0 0 8px;">{{product_description}}</p>
            <a href="{{product_link}}" style="font-size:13px;color:#5A6FFF;font-weight:600;text-decoration:none;">Shop Now →</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:24px 32px;background-color:#2A2828;text-align:center;">
      <p style="font-size:12px;color:#ACB7FF;margin:0 0 12px;">Follow us</p>
      <a href="{{instagram}}" style="color:#ACB7FF;text-decoration:none;margin:0 8px;">Instagram</a>
      <a href="{{facebook}}" style="color:#ACB7FF;text-decoration:none;margin:0 8px;">Facebook</a>
      <a href="{{tiktok}}" style="color:#ACB7FF;text-decoration:none;margin:0 8px;">TikTok</a>
      <p style="font-size:11px;color:#666;margin:16px 0 0;">
        <a href="{{unsubscribe}}" style="color:#666;text-decoration:underline;">Unsubscribe</a> |
        <a href="{{view_in_browser}}" style="color:#666;text-decoration:underline;">View in browser</a>
      </p>
      <p style="font-size:10px;color:#444;margin:8px 0 0;">© 2026 Conceivable. All rights reserved.</p>
    </td>
  </tr>
</table>`,
};

/**
 * POST /api/mailchimp/automations
 * Body: { action: "get_templates" | "create_automation", flow: "abandoned_cart" | "post_purchase" | "post_app_download" | "newsletter" }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, flow } = body;

    if (action === "get_templates") {
      const templates: Record<string, unknown> = {
        abandoned_cart: ABANDONED_CART_FLOW,
        post_purchase: POST_PURCHASE_FLOW,
        post_app_download: POST_APP_DOWNLOAD_FLOW,
        newsletter: NEWSLETTER_TEMPLATE,
      };

      if (flow && templates[flow]) {
        return NextResponse.json(templates[flow]);
      }

      return NextResponse.json(templates);
    }

    if (action === "create_automation") {
      if (!process.env.MAILCHIMP_API_KEY) {
        return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mc = getClient() as any;
      // Get list ID
      const listsResponse = await mc.lists.getAllLists({ count: 1 });
      const listId = listsResponse?.lists?.[0]?.id;
      if (!listId) {
        return NextResponse.json({ error: "No Mailchimp list found" }, { status: 404 });
      }

      // Note: Mailchimp's classic automation API has limitations.
      // For complex customer journeys, they recommend using the Mailchimp UI.
      // We can create the campaign templates and provide instructions.
      return NextResponse.json({
        message: "Automation templates prepared. Complex automations (abandoned cart, post-purchase) are best configured in Mailchimp's Customer Journey Builder using these templates.",
        listId,
        templates: flow
          ? { [flow]: flow === "abandoned_cart" ? ABANDONED_CART_FLOW : flow === "post_purchase" ? POST_PURCHASE_FLOW : POST_APP_DOWNLOAD_FLOW }
          : { abandoned_cart: ABANDONED_CART_FLOW, post_purchase: POST_PURCHASE_FLOW, post_app_download: POST_APP_DOWNLOAD_FLOW },
        instructions: {
          abandoned_cart: "In Mailchimp → Automations → Customer Journeys → E-Commerce → Abandoned Cart. Use the email content from the templates above.",
          post_purchase: "In Mailchimp → Automations → Customer Journeys → Post-Purchase. Set delays per the template specifications.",
          post_app_download: "Requires webhook from app tracking system to Mailchimp. Tag contacts with 'App User' then trigger automation on tag addition.",
          newsletter: "In Mailchimp → Campaigns → Create → Email → Regular. Use the HTML template provided. Schedule for every Friday.",
        },
      });
    }

    return NextResponse.json({ error: "Unknown action. Use 'get_templates' or 'create_automation'." }, { status: 400 });
  } catch (err) {
    console.error("POST automations error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process automation request" },
      { status: 500 }
    );
  }
}
