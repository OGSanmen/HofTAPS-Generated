export function showToast(type = "success", message = "") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

  