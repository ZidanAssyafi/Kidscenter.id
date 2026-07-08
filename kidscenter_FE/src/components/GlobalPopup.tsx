"use client";
import React, { useEffect, useState } from "react";
import { useSharedState } from "@/lib/useSharedState";
import "./GlobalPopup.css";

export default function GlobalPopup() {
  const [popupData, setPopupData] = useSharedState("kc_popup_msg", { message: "", timestamp: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (popupData.message && popupData.timestamp > 0) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, [popupData]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="global-popup-overlay" onClick={() => setVisible(false)}>
      <div className="global-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="global-popup-close-btn" onClick={() => setVisible(false)}>✕</button>
        <p className="global-popup-message">{popupData.message}</p>
        <button className="global-popup-btn" onClick={() => setVisible(false)}>OK</button>
      </div>
    </div>
  );
}
