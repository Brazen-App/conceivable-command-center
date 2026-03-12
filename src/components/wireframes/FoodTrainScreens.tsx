"use client";

const B = "#5A6FFF"; const BB = "#ACB7FF"; const GRN = "#1EAA55"; const PNK = "#E37FB1"; const YLW = "#F1C028"; const TEAL = "#78C3BF"; const RED = "#E24D47"; const PRP = "#9686B9"; const OW = "#F9F7F0"; const BG = "#FAFAFA";

/* ── Shared Nav Bar ─── */
function NavBar({ title, back = true, rightElement }: { title: string; back?: boolean; rightElement?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid #F0F0F0", backgroundColor: "#FFF" }}>
      {back && <span style={{ fontSize: 20, color: B }}>&#8249;</span>}
      <span style={{ fontSize: 16, fontWeight: 700, color: "#2A2828" }}>{title}</span>
      {rightElement && <div style={{ marginLeft: "auto" }}>{rightElement}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 4A: Food Train Setup
   ═══════════════════════════════════════════════════════════ */
export function FoodTrainSetup() {
  const dietaryTags = ["Pescatarian", "Gluten-free"];
  const allergyTags = ["Tree nuts"];
  const favoriteTags = ["Salmon bowls", "Soups", "Casseroles"];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <NavBar title="Food Train Setup" />

      {/* Olive greeting */}
      <div style={{ padding: "20px 20px 12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 20,
          background: `linear-gradient(135deg, ${GRN}30, ${TEAL}25)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>
          🌿
        </div>
        <div style={{
          flex: 1, padding: "10px 14px", borderRadius: 14,
          backgroundColor: "#FFF", border: "1px solid #F0F0F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.55 }}>
            I&apos;ve pre-filled some of this from your nutrition profile. Just review and tweak anything that needs updating.
          </div>
        </div>
      </div>

      {/* Form sections */}
      <div style={{ flex: 1, padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Dietary Preferences */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2828" }}>Dietary Preferences</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: B, cursor: "pointer" }}>Edit</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {dietaryTags.map((tag) => (
              <div key={tag} style={{
                padding: "7px 14px", borderRadius: 20,
                backgroundColor: `${GRN}12`, border: `1px solid ${GRN}30`,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke={GRN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: GRN }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2828" }}>Allergies</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {allergyTags.map((tag) => (
              <div key={tag} style={{
                padding: "7px 14px", borderRadius: 20,
                backgroundColor: `${RED}10`, border: `1px solid ${RED}25`,
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>{tag}</span>
              </div>
            ))}
            <div style={{
              padding: "7px 14px", borderRadius: 20,
              backgroundColor: "#FFF", border: "1px dashed #CCC",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 14, color: "#BBB", lineHeight: 1 }}>+</span>
              <span style={{ fontSize: 11, color: "#999" }}>Add</span>
            </div>
          </div>
        </div>

        {/* Household */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2828", display: "block", marginBottom: 10 }}>Household</span>
          <div style={{
            padding: "12px 16px", borderRadius: 12,
            backgroundColor: "#FFF", border: "1px solid #F0F0F0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 13, color: "#444" }}>2 adults, 1 newborn</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
              <path d="M8 5l8 7-8 7" stroke="#2A2828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Delivery Notes */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2828", display: "block", marginBottom: 10 }}>Delivery Notes</span>
          <div style={{
            padding: "12px 16px", borderRadius: 12,
            backgroundColor: "#FFF", border: "1px solid #F0F0F0",
            minHeight: 72,
          }}>
            <span style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>Please ring doorbell and leave on porch</span>
          </div>
        </div>

        {/* Favorite Meals */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2828", display: "block", marginBottom: 10 }}>Favorite Meals</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {favoriteTags.map((tag) => (
              <div key={tag} style={{
                padding: "7px 14px", borderRadius: 20,
                backgroundColor: `${TEAL}12`, border: `1px solid ${TEAL}25`,
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEAL }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div style={{ padding: "16px 20px 24px" }}>
        <div style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          background: `linear-gradient(135deg, ${B}, #4A5FEF)`,
          textAlign: "center", cursor: "pointer",
          boxShadow: `0 4px 16px ${B}35`,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>Save &amp; Create Invite</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 4B: Food Train Invite (Shareable Link — No App Chrome)
   ═══════════════════════════════════════════════════════════ */
export function FoodTrainInvite() {
  const calendarDays = [
    { date: "Mar 17", day: "Mon", person: null, meal: null },
    { date: "Mar 18", day: "Tue", person: "Lisa B.", meal: "Chicken soup" },
    { date: "Mar 19", day: "Wed", person: null, meal: null },
    { date: "Mar 20", day: "Thu", person: "Mom", meal: "Lasagna" },
    { date: "Mar 21", day: "Fri", person: null, meal: null },
    { date: "Mar 22", day: "Sat", person: "Aunt Diane", meal: "Pot roast" },
    { date: "Mar 23", day: "Sun", person: null, meal: null },
    { date: "Mar 24", day: "Mon", person: "Jen K.", meal: "Stir fry" },
    { date: "Mar 25", day: "Tue", person: null, meal: null },
    { date: "Mar 26", day: "Wed", person: null, meal: null },
    { date: "Mar 27", day: "Thu", person: "Mia R.", meal: "Enchiladas" },
    { date: "Mar 28", day: "Fri", person: null, meal: null },
    { date: "Mar 29", day: "Sat", person: "Sam T.", meal: "Soup & bread" },
    { date: "Mar 30", day: "Sun", person: null, meal: null },
    { date: "Mar 31", day: "Mon", person: null, meal: null },
    { date: "Apr 1", day: "Tue", person: "Coworker Amy", meal: "Pasta bake" },
    { date: "Apr 2", day: "Wed", person: null, meal: null },
    { date: "Apr 3", day: "Thu", person: null, meal: null },
    { date: "Apr 4", day: "Fri", person: "Neighbor Beth", meal: "Chili" },
    { date: "Apr 5", day: "Sat", person: null, meal: null },
    { date: "Apr 6", day: "Sun", person: null, meal: null },
  ];

  const dietaryTags = ["Pescatarian", "Gluten-free", "No tree nuts"];

  return (
    <div style={{ backgroundColor: "#FDF8F4", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header — warm, personal, no app chrome */}
      <div style={{ padding: "36px 24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🚂</div>
        <h1 style={{
          fontSize: 26, fontWeight: 700, color: "#3A3030",
          fontFamily: "Georgia, 'Times New Roman', serif",
          margin: "0 0 8px",
          lineHeight: 1.3,
        }}>
          Sarah&apos;s Food Train
        </h1>
        <p style={{
          fontSize: 14, color: "#7A6B60", lineHeight: 1.6,
          margin: 0, maxWidth: 320, marginLeft: "auto", marginRight: "auto",
        }}>
          Help keep the Johnson family fed during their first weeks with baby
        </p>
      </div>

      {/* Calendar grid */}
      <div style={{ padding: "0 16px 20px" }}>
        <div style={{
          backgroundColor: "#FFF", borderRadius: 16, overflow: "hidden",
          border: "1px solid #F0E8E0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          {/* Week headers */}
          {[0, 7, 14].map((weekStart, weekIdx) => (
            <div key={weekIdx}>
              <div style={{
                padding: "10px 16px", backgroundColor: weekIdx === 0 ? `${PNK}08` : "#FAFAF6",
                borderBottom: "1px solid #F0E8E0",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#9A8A80", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {weekIdx === 0 ? "This Week" : weekIdx === 1 ? "Week 2" : "Week 3"}
                </span>
              </div>
              {calendarDays.slice(weekStart, weekStart + 7).map((d, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px",
                  borderBottom: "1px solid #F8F2EC",
                  backgroundColor: d.person ? "#FFF" : `${GRN}03`,
                }}>
                  <div style={{ width: 44, flexShrink: 0 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#BBB", textTransform: "uppercase" }}>{d.day}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#3A3030" }}>{d.date.split(" ")[1]}</div>
                  </div>
                  {d.person ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 14,
                        backgroundColor: `${TEAL}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12,
                      }}>
                        🍲
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#3A3030" }}>{d.person}</div>
                        <div style={{ fontSize: 10, color: "#999" }}>{d.meal}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#BBB" }}>Available</span>
                      <div style={{
                        padding: "5px 12px", borderRadius: 12,
                        backgroundColor: `${PNK}12`, border: `1px solid ${PNK}25`,
                        cursor: "pointer",
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: PNK }}>Sign up</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Her Preferences */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#3A3030", marginBottom: 8 }}>Her Preferences</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {dietaryTags.map((tag) => (
            <div key={tag} style={{
              padding: "5px 12px", borderRadius: 16,
              backgroundColor: `${TEAL}10`, border: `1px solid ${TEAL}20`,
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: TEAL }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Instructions */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#3A3030", marginBottom: 8 }}>Delivery Instructions</div>
        <div style={{
          padding: "12px 16px", borderRadius: 12,
          backgroundColor: "#FFF", border: "1px solid #F0E8E0",
        }}>
          <span style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
            Please ring doorbell and leave on porch. We&apos;re at the yellow house, second on the left.
          </span>
        </div>
      </div>

      {/* Sign Up button — warm pink, not brand blue */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          background: `linear-gradient(135deg, ${PNK}, #D06A9A)`,
          textAlign: "center", cursor: "pointer",
          boxShadow: `0 4px 16px ${PNK}35`,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>Sign Up to Bring a Meal</span>
        </div>
      </div>

      {/* Footer — very subtle branding */}
      <div style={{ padding: "16px 20px 24px", textAlign: "center" }}>
        <span style={{ fontSize: 10, color: "#CCC" }}>Powered by Conceivable</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 4C: Food Train Dashboard (Her Management View)
   ═══════════════════════════════════════════════════════════ */
export function FoodTrainDashboard() {
  const weekDays = [
    { day: "Mon", person: "Lisa B.", meal: "Chicken soup", status: "delivered" },
    { day: "Tue", person: null, meal: null, status: "gap" },
    { day: "Wed", person: "Mom", meal: "Lasagna", status: "upcoming" },
    { day: "Thu", person: "Jen K.", meal: "Stir fry", status: "upcoming" },
    { day: "Fri", person: null, meal: null, status: "gap" },
    { day: "Sat", person: "Aunt Diane", meal: "Pot roast", status: "upcoming" },
    { day: "Sun", person: "Sam T.", meal: "Soup & bread", status: "upcoming" },
  ];

  const upcoming = [
    { person: "Mom", meal: "Lasagna", date: "Wed, Mar 19", thanked: false },
    { person: "Jen K.", meal: "Stir fry", date: "Thu, Mar 20", thanked: false },
    { person: "Aunt Diane", meal: "Pot roast", date: "Sat, Mar 22", thanked: false },
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <NavBar title="Food Train" rightElement={
        <div style={{
          padding: "4px 10px", borderRadius: 10,
          backgroundColor: `${GRN}12`, border: `1px solid ${GRN}25`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: GRN }}>Active</span>
        </div>
      } />

      {/* Stats row */}
      <div style={{
        margin: "14px 16px", padding: "14px 12px", borderRadius: 14,
        background: `linear-gradient(135deg, ${GRN}08, ${TEAL}08)`,
        border: `1px solid ${GRN}15`,
        display: "flex", justifyContent: "space-around", alignItems: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: GRN }}>12</div>
          <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>meals signed up</div>
        </div>
        <div style={{ width: 1, height: 28, backgroundColor: "#E0E0E0" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: YLW }}>3</div>
          <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>gaps remaining</div>
        </div>
        <div style={{ width: 1, height: 28, backgroundColor: "#E0E0E0" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: PNK }}>6</div>
          <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>thank yous sent</div>
        </div>
      </div>

      {/* This Week label */}
      <div style={{ padding: "8px 20px 6px" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>This Week</span>
      </div>

      {/* Week calendar */}
      <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        {weekDays.map((d, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            backgroundColor: "#FFF", borderRadius: 12,
            border: d.status === "gap" ? `1px dashed ${YLW}50` : "1px solid #F0F0F0",
          }}>
            <div style={{
              width: 36, fontSize: 11, fontWeight: 700,
              color: d.status === "gap" ? YLW : "#888",
              flexShrink: 0,
            }}>
              {d.day}
            </div>

            {d.status === "delivered" && (
              <>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: `${GRN}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke={GRN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#2A2828" }}>{d.person}</div>
                  <div style={{ fontSize: 10, color: "#999" }}>{d.meal}</div>
                </div>
                <div style={{
                  padding: "4px 8px", borderRadius: 8,
                  backgroundColor: `${PNK}10`,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: PNK }}>Thanked ✓</span>
                </div>
              </>
            )}

            {d.status === "gap" && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: YLW,
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: YLW }}>Available</span>
                </div>
              </div>
            )}

            {d.status === "upcoming" && (
              <>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: `${TEAL}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12,
                }}>
                  🍲
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#2A2828" }}>{d.person}</div>
                  <div style={{ fontSize: 10, color: "#999" }}>{d.meal}</div>
                </div>
                <span style={{ fontSize: 10, color: "#BBB" }}>Upcoming</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Fill Gaps button */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          width: "100%", padding: "12px 0", borderRadius: 12,
          backgroundColor: `${YLW}15`, border: `1px solid ${YLW}30`,
          textAlign: "center", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>📤</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#B8900A" }}>Share Invite to Fill Gaps</span>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
          Upcoming Deliveries
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.map((u, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              backgroundColor: "#FFF", borderRadius: 12, border: "1px solid #F0F0F0",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${GRN}15, ${TEAL}12)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>
                🍲
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#2A2828" }}>{u.person} — {u.meal}</div>
                <div style={{ fontSize: 10, color: "#999" }}>{u.date}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                <path d="M8 5l8 7-8 7" stroke="#2A2828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 4D: Food Train Thank You
   ═══════════════════════════════════════════════════════════ */
export function FoodTrainThankYou() {
  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <NavBar title="Say Thanks" />

      {/* Notification banner */}
      <div style={{
        margin: "14px 16px", padding: "14px 16px", borderRadius: 14,
        background: `linear-gradient(135deg, ${GRN}12, ${TEAL}10)`,
        border: `1px solid ${GRN}20`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🎉</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2828" }}>Lisa&apos;s chicken soup was delivered today!</div>
          <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Arrived at 5:30 PM</div>
        </div>
      </div>

      {/* Pre-drafted thank you card */}
      <div style={{ padding: "8px 16px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
          Your Thank You Note
        </div>
        <div style={{
          padding: "20px", borderRadius: 16,
          backgroundColor: "#FFF",
          border: `1px solid ${PNK}20`,
          boxShadow: `0 2px 12px ${PNK}08`,
          position: "relative",
        }}>
          {/* Decorative corner */}
          <div style={{ position: "absolute", top: 12, right: 14, fontSize: 18, opacity: 0.3 }}>💛</div>
          <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7, paddingRight: 24 }}>
            Lisa, thank you so much for the chicken soup! It was exactly what we needed today. You&apos;re the best. 💛
          </div>
          <div style={{
            marginTop: 14, display: "flex", alignItems: "center", gap: 6,
            cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={B} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={B} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: B }}>Customize message</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: "20px 16px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          background: `linear-gradient(135deg, ${PNK}, #D06A9A)`,
          textAlign: "center", cursor: "pointer",
          boxShadow: `0 4px 16px ${PNK}35`,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>Send As Is</span>
        </div>
        <div style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          backgroundColor: "#FFF", border: `1px solid ${PNK}30`,
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: PNK }}>Edit &amp; Send</span>
        </div>
      </div>

      {/* Delivery method toggle */}
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
          Send Via
        </div>
        <div style={{
          display: "flex", borderRadius: 12, overflow: "hidden",
          border: "1px solid #E8E8E8",
        }}>
          <div style={{
            flex: 1, padding: "10px 0", textAlign: "center",
            backgroundColor: `${B}10`, borderRight: "1px solid #E8E8E8",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: B }}>📱 Text</span>
          </div>
          <div style={{
            flex: 1, padding: "10px 0", textAlign: "center",
            backgroundColor: "#FFF",
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>📧 Email</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
          Preview — What Lisa Will See
        </div>
        <div style={{
          padding: "14px 16px", borderRadius: 14,
          backgroundColor: "#FFF", border: "1px solid #F0F0F0",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            padding: "10px 14px", borderRadius: 12,
            backgroundColor: "#E8F5E9",
            marginBottom: 6,
          }}>
            <div style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>
              Lisa, thank you so much for the chicken soup! It was exactly what we needed today. You&apos;re the best. 💛
            </div>
            <div style={{ fontSize: 10, color: "#999", marginTop: 6 }}>— Sarah</div>
          </div>
          <div style={{ fontSize: 9, color: "#CCC", textAlign: "center", marginTop: 4 }}>
            SMS preview
          </div>
        </div>
      </div>

      {/* Helper note */}
      <div style={{ padding: "12px 20px 24px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#BBB", fontStyle: "italic" }}>
          The lazy version takes 2 taps. The personal version takes as long as you want.
        </span>
      </div>
    </div>
  );
}

/* ── Export Registry ─── */
export const FOOD_TRAIN_SCREENS = [
  { id: "pp-food-train-setup", title: "Food Train Setup", description: "Food profile form with dietary preferences, allergies, household size, and delivery notes — pre-filled by Olive", component: FoodTrainSetup },
  { id: "pp-food-train-invite", title: "Food Train Invite", description: "Shareable web page friends see to sign up for meal delivery days — warm, personal, not heavily branded", component: FoodTrainInvite },
  { id: "pp-food-train-dashboard", title: "Food Train Dashboard", description: "Management view with weekly calendar, gap indicators, stats, and upcoming deliveries", component: FoodTrainDashboard },
  { id: "pp-food-train-thankyou", title: "Food Train Thank You", description: "Post-delivery thank you flow with pre-drafted note, edit option, and send via text or email", component: FoodTrainThankYou },
];
