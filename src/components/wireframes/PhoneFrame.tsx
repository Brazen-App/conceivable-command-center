"use client";

interface PhoneFrameProps {
  children: React.ReactNode;
  scale?: number;
}

export default function PhoneFrame({ children, scale = 0.55 }: PhoneFrameProps) {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: 375,
        height: 812,
        borderRadius: 44,
        border: "8px solid #1A1A1A",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 32,
          borderRadius: 20,
          backgroundColor: "#1A1A1A",
          zIndex: 50,
        }}
      />
      {/* Status Bar */}
      <div
        style={{
          height: 54,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 24px 4px",
          fontSize: 12,
          fontWeight: 600,
          color: "#1A1A1A",
        }}
      >
        <span>9:41</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="4" width="3" height="8" rx="1" fill="#1A1A1A" />
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#1A1A1A" />
            <rect x="9" y="0" width="3" height="12" rx="1" fill="#1A1A1A" />
            <rect x="13" y="0" width="3" height="12" rx="1" fill="#D1D1D6" />
          </svg>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="#1A1A1A" />
            <rect x="2" y="2" width="16" height="8" rx="1" fill="#1A1A1A" />
            <rect x="22.5" y="3.5" width="1.5" height="5" rx="0.75" fill="#1A1A1A" />
          </svg>
        </span>
      </div>
      {/* Screen Content */}
      <div style={{ height: 812 - 54 - 34, overflow: "auto" }}>
        {children}
      </div>
      {/* Home Indicator */}
      <div
        style={{
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 134,
            height: 5,
            borderRadius: 3,
            backgroundColor: "#1A1A1A",
          }}
        />
      </div>
    </div>
  );
}
