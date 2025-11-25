// show a modal with expanded character details
function showModal(character) {
    // overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    // modal
    const modal = document.createElement("div");
    modal.className = "modal";

    const img = document.createElement("img");
    img.className = "modal-image";
    img.src = character.image;
    img.alt = character.name;

    const content = document.createElement("div");
    content.className = "modal-content";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "✕";
    closeBtn.onclick = () => document.body.removeChild(overlay);

    const title = document.createElement("div");
    title.className = "modal-title";
    title.textContent = character.name;

    const meta1 = document.createElement("div");
    meta1.className = "modal-meta";
    meta1.innerHTML = `<strong>Species:</strong> ${character.species} • <strong>Gender:</strong> ${character.gender}`;

    const meta2 = document.createElement("div");
    meta2.className = "modal-meta";
    meta2.innerHTML = `<strong>Status:</strong> ${character.status} • <strong>Origin:</strong> ${character.origin.name}`;

    const location = document.createElement("div");
    location.className = "modal-meta";
    location.innerHTML = `<strong>Location:</strong> ${character.location.name}`;

    const created = document.createElement("div");
    created.className = "modal-meta";
    created.innerHTML = `<strong>Created:</strong> ${new Date(character.created).toLocaleString()}`;

    const episodesTitle = document.createElement("div");
    episodesTitle.className = "modal-meta";
    episodesTitle.textContent = `Episodes (${character.episode.length})`;

    const episodesList = document.createElement("div");
    episodesList.className = "modal-episodes";
    // show episodes as numbered badges (extract id from URL)
    episodesList.innerHTML = character.episode
        .map((ep) => {
            try {
                const parts = ep.split("/");
                const idStr = parts[parts.length - 1] || parts[parts.length - 2];
                const idNum = parseInt(idStr, 10);
                const display = Number.isFinite(idNum) ? String(idNum).padStart(2, "0") : idStr;
                return `<div class="episode-badge" ">E${display}</div>`;
            } catch (e) {
                return `<div class="episode-badge"">EP</div>`;
            }
        })
        .join("");

    content.appendChild(closeBtn);
    content.appendChild(title);
    content.appendChild(meta1);
    content.appendChild(meta2);
    content.appendChild(location);
    content.appendChild(created);
    content.appendChild(episodesTitle);
    content.appendChild(episodesList);

    modal.appendChild(img);
    modal.appendChild(content);

    // close when clicking overlay (outside modal)
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // close on escape
    function onKey(e) {
        if (e.key === "Escape") {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
            document.removeEventListener("keydown", onKey);
        }
    }
    document.addEventListener("keydown", onKey);
}

export { showModal };
