// ===============================
// 🔓 BCR TOOL – OFFLINE SHIM
// ===============================

// Fake logged-in user
window.__OFFLINE_USER__ = {
  uid: "offline-user",
  email: "offline@local"
};

// Fake Firebase auth state
window.firebase = window.firebase || {};
window.firebase.auth = () => ({
  currentUser: window.__OFFLINE_USER__
});

// Prevent forced redirect to index.html
const originalLocation = window.location;
Object.defineProperty(window, "location", {
  writable: true,
  value: {
    ...originalLocation,
    set href(val) {
      if (val.includes("index.html")) {
        console.warn("🔓 Offline mode: redirect blocked");
        return;
      }
      originalLocation.href = val;
    }
  }
});

// Unlimited tokens
window.__OFFLINE_TOKENS__ = 999999;

// Patch alert for token warning
const originalAlert = window.alert;
window.alert = (msg) => {
  if (typeof msg === "string" && msg.toLowerCase().includes("token")) {
    console.warn("🔓 Offline mode: token alert suppressed");
    return;
  }
  originalAlert(msg);
};

// Debug banner
console.log("✅ BCR TOOL OFFLINE MODE ENABLED");
