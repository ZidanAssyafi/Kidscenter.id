export const showPopup = (message: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem('kc_popup_msg', JSON.stringify({ message, timestamp: Date.now() }));
    window.dispatchEvent(new Event("local-storage-sync"));
  }
};
