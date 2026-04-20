# Halo Ring Integration Scope Document

**Date:** April 13, 2026
**Status:** SCOPE / PLAN -- No code written yet
**Goal:** The Halo Ring app sends health data to a CC API endpoint, which stores it. Kai can then reference this data in conversations.

---

## 1. What the Halo Ring Collects (SDK Analysis)

### Data Points from the Ring App

Based on analysis of the SDK codebase at `dashboard-native-app-ring-sdk-waleed/`, the app tracks the following health data:

| Metric | Source | Current State |
|--------|--------|--------------|
| **Temperature** (BBT) | Ring sensor + manual input | Active -- fetched from `GET /api/user/get-temperatures/`, displayed on home screen and progress page. Includes today's temp, follicular avg, luteal avg. |
| **HRV** | Ring sensor | Displayed on progress page as a score category. Not yet wired to live ring data. |
| **SpO2 / VO2 Max** | Ring sensor | Score category on progress page. Placeholder value (50). |
| **Sleep** | Ring sensor | Score category on progress page. Placeholder value (50). |
| **Stress** | Ring sensor + manual self-report (Low/Medium/High) | Both ring-derived and user-reported on home screen. |
| **Steps** | Ring sensor | Score category on progress page. Placeholder value (30). |
| **Energy** | Manual self-report (1-5 scale) | User selects on home screen. Also a score category. |
| **Blood / Blood Sugar** | Questionnaire-derived | Score categories on progress page. |
| **Hormones** | Questionnaire-derived | Score category on progress page. |

### How the Ring Connects

- **Native bridge:** `RingsSDKBridge.js` wraps a `RingManagerBridge` native module with methods: `startScan()`, `stopScan()`, `connectToDevice(uuid)`, `disconnect()`, `syncTime()`
- **React hook:** `hooks/ringHook.jsx` exposes `useRing()` with events: `ringDataReceived`, `ringConnectionChanged`, `ringError`
- **Platform:** Currently Android-only (`Platform.OS !== 'android'` returns early in the hook)
- **Ring data shape:** The `ringDataReceived` event emits a `data` object, but the exact schema is defined in the native module (not visible in JS). Based on the progress page score categories, the ring sends: temperature, HRV, SpO2, sleep metrics, stress, and steps.

### Existing Scores API

The backend at `conceivable-dashboard-node-goz8l.ondigitalocean.app` has:
- `GET /api/get-scores` -- returns `{ scores: { temperature, blood, hormones, energy, stress }, conceivableScore: { all[], thisMonth, firstMonth, average } }`
- `GET /api/user/get-temperatures/` -- returns `{ allTemps: { avg } }`
- `POST /api/auth/updateTasks` -- marks daily tasks complete
- `POST /api/upload-macros-image` -- food photo analysis
- `POST /analysis-chat-bot` -- Flask-based analysis chatbot (separate from Kai)

### Conceivable Score

The progress page shows a composite "Conceivable Score" made up of 9 sub-scores: Energy, Blood, Hormones, HRV, VO2 Max, Blood Sugar, Sleep, Stress, Steps. The ring provides direct sensor data for 5 of these (Temperature, HRV, SpO2, Sleep, Steps), with Stress being a hybrid of sensor + self-report.

---

## 2. Current Data Flow

```
Halo Ring (BLE) --> Native SDK (Android) --> RingModule events --> React Native app
                                                                      |
                                                                      v
                                                            Dashboard Node API
                                                  (conceivable-dashboard-node on DigitalOcean)
                                                                      |
                                                                      v
                                                              MongoDB (assumed)
```

The ring app currently sends data to the **existing Conceivable dashboard backend** on DigitalOcean, not to the Command Center. Authentication uses a JWT stored in AsyncStorage (`authToken`), passed as `auth-token` header.

---

## 3. Integration Plan

### 3A. New Prisma Model: `RingDataPoint`

Add to `prisma/schema.prisma`:

```prisma
model RingDataPoint {
  id          String   @id @default(cuid())
  email       String
  date        String   // YYYY-MM-DD
  temperature Float?   // BBT in Fahrenheit
  hrv         Float?   // Heart rate variability in ms
  spo2        Float?   // Blood oxygen percentage
  sleep       Json?    // { duration: minutes, quality: 1-100, deep: min, rem: min, light: min }
  stress      Float?   // 0-100 scale
  steps       Int?     // Daily step count
  energy      Int?     // 1-5 self-reported
  raw         Json?    // Full raw payload from ring for future use
  source      String   @default("ring") // "ring" | "manual" | "sync"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([email, date, source])
  @@index([email, date])
}
```

**Why a new model instead of SiteConfig:** SiteConfig is a key-value store for simple settings. Ring data is time-series health data per user -- it needs proper indexing by email+date, typed columns for each metric, and the ability to query ranges efficiently.

**Why not modify KaiSession:** KaiSession stores conversation state. Ring data is independent health telemetry that should persist even if a chat session is cleared.

### 3B. POST /api/ring-data -- Receive Ring Data

**Endpoint:** `POST /api/ring-data`

**Auth:** API key in header (`x-ring-api-key`) -- shared secret between ring app and CC. We avoid JWT because the ring app's auth system is separate (DigitalOcean backend). The API key approach keeps things simple for v1.

**Request body:**
```json
{
  "email": "user@example.com",
  "date": "2026-04-13",
  "temperature": 97.8,
  "hrv": 42.5,
  "spo2": 98.2,
  "sleep": {
    "duration": 462,
    "quality": 78,
    "deep": 95,
    "rem": 110,
    "light": 257
  },
  "stress": 35.0,
  "steps": 8432,
  "energy": 3,
  "raw": { ... }
}
```

**Behavior:**
- Upsert on `[email, date, source]` -- if data for today already exists, update it (the ring syncs multiple times per day as new data comes in)
- Validate email is non-empty, date is valid YYYY-MM-DD
- All metric fields are optional (ring may sync partial data)
- Return `{ ok: true, id: "..." }`

**Rate limit:** No more than 100 writes per email per day (prevent abuse).

### 3C. GET /api/ring-data -- Retrieve Ring Data for Kai

**Endpoint:** `GET /api/ring-data?email=user@example.com&days=14`

**Auth:** Same API key, or internal-only (called by Kai's chat endpoint server-side).

**Response:**
```json
{
  "email": "user@example.com",
  "dataPoints": [
    {
      "date": "2026-04-13",
      "temperature": 97.8,
      "hrv": 42.5,
      "spo2": 98.2,
      "sleep": { "duration": 462, "quality": 78 },
      "stress": 35.0,
      "steps": 8432,
      "energy": 3
    },
    {
      "date": "2026-04-12",
      "temperature": 97.6,
      ...
    }
  ],
  "summary": {
    "avgTemperature": 97.7,
    "avgHrv": 41.2,
    "avgSpo2": 97.9,
    "avgSleepDuration": 445,
    "avgSleepQuality": 72,
    "avgStress": 38.5,
    "avgSteps": 7850,
    "temperatureTrend": "stable",
    "hrvTrend": "improving",
    "daysCovered": 12
  }
}
```

**Summary computation:** Done server-side in the GET handler. Calculates averages and simple trend (comparing last 3 days to previous 7 days: "improving", "declining", "stable").

**`days` parameter:** Defaults to 14. Max 90.

### 3D. Kai Prompt Update

Currently Kai's system prompt in `/src/app/api/kai/chat/route.ts` receives quiz context (score, category breakdown, interpretation). We add a ring data section.

**How it works:**
1. When `POST /api/kai/chat` receives a message with `context.email`, the handler fetches ring data server-side: `GET /api/ring-data?email=...&days=14` (internal call, no network hop -- direct Prisma query)
2. If ring data exists, append to the system prompt:

```
HALO RING DATA (last 14 days):
- Temperature: avg 97.7F, trend: stable. Today: 97.8F. Yesterday: 97.6F.
- HRV: avg 41.2ms, trend: improving (+8% over past week). Today: 42.5ms.
- SpO2: avg 97.9%, stable. Today: 98.2%.
- Sleep: avg 7.4 hrs, quality 72/100. Last night: 7.7 hrs, quality 78/100.
- Stress: avg 38.5/100, trend: stable. Today: 35.0.
- Steps: avg 7,850/day. Today: 8,432.
- Data available for 12 of last 14 days.

Use this data naturally in conversation. Reference specific numbers when the user asks about their health. Notice trends ("Your HRV has been improving this week -- that's great!"). Flag concerns gently ("I notice your sleep quality dipped the last few nights -- how are you feeling?"). Never be alarmist. Always frame data as one piece of a bigger picture.

IMPORTANT: Temperature data is especially relevant for fertility tracking. A sustained temperature rise of 0.2+ degrees typically indicates ovulation has occurred. Note patterns in follicular vs luteal phase temperatures when relevant.
```

3. If no ring data exists, add nothing (Kai works fine without it, as it does today).

**Prompt token budget:** The ring data section adds ~200-300 tokens to the system prompt. With Haiku at 200k context, this is negligible.

### 3E. Changes Needed in the Ring App

The ring app currently sends all data to the DigitalOcean backend. We need it to **also** send to the CC. Two options:

**Option A: Dual-send from the app (recommended for v1)**
- Add a new API module in the ring app: `api/ringSync.jsx`
- After the ring syncs data to the existing backend, also POST to `https://conceivable-command-center.vercel.app/api/ring-data`
- Include the user's email (available from `AuthContext.currentuser`) and the ring data
- Fire-and-forget -- don't block the UI if the CC sync fails
- Add the CC API key as an environment variable in the ring app's config

**Option B: Backend relay (future)**
- The DigitalOcean backend relays ring data to the CC via a webhook
- Cleaner but requires changes to the DigitalOcean backend (which we may not control)

**Specific file changes in the ring app:**

1. **`configure/environment.js`** -- add CC API URL:
   ```js
   const Config = {
     API_URL: 'http://192.168.137.14:5000',
     CC_API_URL: 'https://conceivable-command-center.vercel.app',
     CC_API_KEY: 'xxx',  // move to env var in production
     ...
   };
   ```

2. **New file `api/ringSync.jsx`** -- POST ring data to CC:
   ```js
   // POST to /api/ring-data with email, date, and all metrics
   ```

3. **`hooks/ringHook.jsx`** -- after `ringDataReceived` event, call the sync function:
   ```js
   eventEmitter.addListener('ringDataReceived', (data) => {
     setRingData(data);
     syncToCC(data, userEmail);  // fire-and-forget
   });
   ```

4. **`app/(tabs)/home.jsx`** -- after manual self-reports (energy, stress, vegetables), also sync those to CC.

---

## 4. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Health data is sensitive (HIPAA-adjacent) | Data is keyed by email only, no SSN/DOB. Ring data is the same sensitivity as quiz data we already store. |
| API key exposure in mobile app | The API key is a shared secret, not a user credential. It prevents random internet traffic from posting, but isn't foolproof. Acceptable for v1. |
| Data ownership | Users can request deletion via existing GDPR/CCPA flows. Add ring data to the deletion pipeline. |
| Rate limiting | Cap at 100 writes per email per day. Reject payloads over 10KB. |
| CORS | The POST endpoint needs CORS headers since the ring app may call it directly. The GET endpoint is server-side only (Kai calls it internally). |

---

## 5. Implementation Phases

### Phase 1: CC Backend (estimated: 1 day)
- [ ] Add `RingDataPoint` model to Prisma schema
- [ ] Run migration
- [ ] Build `POST /api/ring-data` endpoint with validation + upsert
- [ ] Build `GET /api/ring-data` endpoint with summary computation
- [ ] Add `RING_API_KEY` env var to Vercel
- [ ] Write basic tests

### Phase 2: Kai Integration (estimated: half day)
- [ ] Modify `/api/kai/chat/route.ts` to query ring data when email is present
- [ ] Build the ring data prompt section generator
- [ ] Test Kai responses with and without ring data
- [ ] Verify token budget stays reasonable

### Phase 3: Ring App Changes (estimated: 1-2 days, depends on Waleed)
- [ ] Add CC config to environment.js
- [ ] Build `api/ringSync.jsx`
- [ ] Wire `ringDataReceived` event to dual-send
- [ ] Wire manual inputs (energy, stress) to also sync
- [ ] Test end-to-end flow: ring sync --> CC storage --> Kai references data

### Phase 4: CC Admin Dashboard (estimated: half day)
- [ ] Add a simple admin view showing ring data ingestion stats
- [ ] Count of users syncing, data points per day, last sync times
- [ ] Surface in the Operations dashboard

---

## 6. What Kai Can Say With This Data

Example Kai responses once ring data is available:

> "I can see from your Halo Ring that your temperature shifted up by 0.3 degrees yesterday -- that's a classic sign that ovulation just happened. Your timing looks good this cycle."

> "Your HRV has been trending up over the past week (from 38 to 43ms) -- that tells me your body is recovering well and your nervous system is in a good place. Keep doing what you're doing."

> "I notice your sleep quality dropped to 58 last night after being in the 70s all week. Did something change? Stress and sleep are deeply connected to fertility, so let's make sure you're getting the rest you need."

> "You've been averaging about 7,800 steps a day -- that's solid. Research shows moderate daily movement (not overtraining) supports reproductive health."

> "Your SpO2 has been consistently at 97-98%, which is perfectly normal. One less thing to worry about."

---

## 7. Open Questions

1. **What is the exact data shape of `ringDataReceived` events?** The native module defines this, and it's not visible in the JS layer. Waleed needs to confirm the exact fields and their units/ranges.

2. **Should we backfill historical data?** If the ring app has been collecting data on the DigitalOcean backend, we could do a one-time migration. This would give Kai immediate context for existing users.

3. **Cycle phase detection:** Temperature data is most useful in the context of cycle phase (follicular vs luteal). Should the ring app send cycle day / period start date? Or should Kai infer phase from the temperature shift?

4. **Multiple syncs per day:** The ring may sync partial data throughout the day (e.g., steps at 2pm, then again at 10pm). The upsert approach handles this, but we should confirm we want "latest wins" or "merge" semantics for the sleep object.

5. **Offline buffer:** If the user's phone has no internet when the ring syncs, should the app queue CC syncs for later? The existing DigitalOcean sync probably handles this already, but the CC sync would need its own retry logic.

---

## 8. Files That Will Be Created/Modified

### Command Center (this repo)
- `prisma/schema.prisma` -- add RingDataPoint model
- `src/app/api/ring-data/route.ts` -- NEW: POST and GET handlers
- `src/app/api/kai/chat/route.ts` -- MODIFY: add ring data to system prompt
- `.env` / Vercel env -- add RING_API_KEY

### Ring App (separate repo)
- `configure/environment.js` -- add CC_API_URL, CC_API_KEY
- `api/ringSync.jsx` -- NEW: sync function to CC
- `hooks/ringHook.jsx` -- MODIFY: call sync on data received
- `app/(tabs)/home.jsx` -- MODIFY: sync manual inputs to CC
