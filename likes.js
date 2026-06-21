const likeStorageKey = (id) => `ai-agent-workroom-liked-${id}`;

function isLiked(id) {
  return localStorage.getItem(likeStorageKey(id)) === "1";
}

function likeTotal(button) {
  const base = Number(button.dataset.likeBase || 0);
  return base + (isLiked(button.dataset.likeId) ? 1 : 0);
}

function hydrateLikes(root = document) {
  root.querySelectorAll("[data-like-id]").forEach((button) => {
    const liked = isLiked(button.dataset.likeId);
    const count = button.querySelector("[data-like-count]");
    button.setAttribute("aria-pressed", liked ? "true" : "false");
    button.classList.toggle("is-liked", liked);
    if (count) count.textContent = likeTotal(button).toLocaleString("ja-JP");
  });
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-like-id]");
  if (!button) return;
  const key = likeStorageKey(button.dataset.likeId);
  if (isLiked(button.dataset.likeId)) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, "1");
  }
  hydrateLikes();
});

window.AgentWorkroomLikes = {
  hydrate: hydrateLikes,
  isLiked
};

hydrateLikes();
