/**
 * PostHog client wrapper for the public site.
 *
 * The dashboard's quiz funnel reads events from PostHog Cloud via REST API
 * (see /api/analytics/quiz). For those queries to return non-zero numbers,
 * the public quiz pages need to actually fire those events. This file is
 * the single place we initialize and call posthog-js from the browser.
 *
 * Events fired:
 *   - quiz_started
 *   - quiz_step_completed   { step: number, questionId: string }
 *   - email_collected
 *   - quiz_completed        { score: number, biggestConcern?: string }
 *   - quiz_cart_clicked     { variant: 'A'|'B', value: number }
 *   - kirsten_video_played
 *   - kirsten_video_completed
 *
 * Note: actual purchase events still come from the Shopify Admin API
 * (see /api/shopify/orders) — Shopify is the source of truth for revenue.
 */
import posthog from "posthog-js";

let initialized = false;

export function initPostHog(): void {
  if (typeof window === "undefined") return;
  if (initialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // gracefully no-op if not configured

  posthog.init(key, {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // we'll fire page-level events manually
    capture_pageleave: true,
    autocapture: false,
    disable_session_recording: true,
  });

  initialized = true;
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!initialized) initPostHog();
  if (!initialized) return; // env var missing
  try {
    posthog.capture(event, properties);
  } catch {
    // never let analytics break the user experience
  }
}

export function identifyUser(
  distinctId: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!initialized) initPostHog();
  if (!initialized) return;
  try {
    posthog.identify(distinctId, properties);
  } catch {
    // ignore
  }
}
