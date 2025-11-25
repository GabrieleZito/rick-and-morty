import { apiCall } from "./apiCall.js";

let currentData = null;

async function loadPage(endpoint = "https://rickandmortyapi.com/api/character") {
    const data = await apiCall(endpoint);
    console.log(data);
    if (data && data.results) {
        currentData = data;
        renderCards(data.results);
        renderPagination();
    }
}

function renderCards(characters) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";

    characters.forEach((character) => {
        const card = createCharacterCard(character);
        cardsContainer.appendChild(card);
    });
}

function createCharacterCard(character) {
    const card = document.createElement("div");
    card.className = "card";

    const statusClass = `status-${character.status.toLowerCase()}`;

    card.innerHTML = `
        <img src="${character.image}" alt="${character.name}" class="card-image" />
        <div class="card-content">
            <div class="card-name">${character.name}</div>
            <div class="card-info">
                <strong>Species:</strong> ${character.species}
            </div>
            <div class="card-info">
                <strong>Episodes:</strong> ${character.episode.length}
            </div>
            <div class="card-info">
                <strong>Origin:</strong> ${character.origin.name}
            </div>
            <span class="card-status ${statusClass}">${character.status}</span>
        </div>
    `;

    return card;
}

function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    // Extract current page number from the API response
    const currentPageNumber = currentData.info.next
        ? new URL(currentData.info.next).searchParams.get("page") - 1
        : currentData.info.pages;

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn";
    prevBtn.textContent = "← Previous";
    prevBtn.disabled = !currentData.info.prev;
    if (currentData.info.prev) {
        prevBtn.onclick = () => loadPage(currentData.info.prev);
    }
    paginationContainer.appendChild(prevBtn);

    // Page info
    const pageInfo = document.createElement("span");
    pageInfo.className = "pagination-info";
    pageInfo.textContent = `Page ${currentPageNumber} of ${currentData.info.pages}`;
    paginationContainer.appendChild(pageInfo);

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn";
    nextBtn.textContent = "Next →";
    nextBtn.disabled = !currentData.info.next;
    if (currentData.info.next) {
        nextBtn.onclick = () => loadPage(currentData.info.next);
    }
    paginationContainer.appendChild(nextBtn);
}

document.addEventListener("DOMContentLoaded", () => {
    loadPage();

    // Search functionality
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    searchBtn.addEventListener("click", () => {
        performSearch();
    });
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            performSearch();
        }
    });
});

function performSearch() {
    const name = document.getElementById("search-input").value.trim();
    const status = document.querySelector("#status-filter").value;
    const gender = document.querySelector("#gender-filter").value;
    const species = document.querySelector("#species-filter").value;
    // build params only for non-empty values
    const params = [];
    if (name) params.push(`name=${encodeURIComponent(name)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (gender) params.push(`gender=${encodeURIComponent(gender)}`);
    if (species) params.push(`species=${encodeURIComponent(species)}`);

    if (params.length === 0) {
        // no filters: load base endpoint
        loadPage();
    } else {
        const query = params.join("&");
        loadPage(`https://rickandmortyapi.com/api/character/?${query}`);
    }
}
