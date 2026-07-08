export const showPopup = (message: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem('kc_popup_msg', JSON.stringify({ message, timestamp: Date.now() }));
    window.dispatchEvent(new CustomEvent("local-storage-sync", { detail: { key: 'kc_popup_msg' } }));
  }
};
