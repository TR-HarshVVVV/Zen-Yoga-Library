document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const difficultySelect = document.getElementById("difficulty-filter");
  const poseCards = document.querySelectorAll(".pose-card");
  const favoritesSection = document.getElementById("favorites-section");

  // Load favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Update favorite buttons and display
  function updateFavorites() {
    // Update favorite buttons
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      const poseId = btn.dataset.poseId;
      const isFavorite = favorites.includes(poseId);
      btn.innerHTML = `<i class="bi bi-star${isFavorite ? "-fill" : ""}"></i>`;
      btn.classList.toggle("btn-warning", isFavorite);
      btn.classList.toggle("btn-outline-warning", !isFavorite);
    });

    // Update favorites section
    favoritesSection.innerHTML = "";
    if (favorites.length === 0) {
      favoritesSection.innerHTML =
        '<div class="col-12 text-center"><p>No favorite poses yet. Click the star icon to add poses to your favorites.</p></div>';
      return;
    }

    favorites.forEach((poseId) => {
      const originalCard = document
        .querySelector(`[data-pose-id="${poseId}"]`)
        .closest(".col-12");
      const cardClone = originalCard.cloneNode(true);
      favoritesSection.appendChild(cardClone);
    });
  }

  // Handle favorite button clicks
  document.addEventListener("click", function (e) {
    if (e.target.closest(".favorite-btn")) {
      const btn = e.target.closest(".favorite-btn");
      const poseId = btn.dataset.poseId;

      const index = favorites.indexOf(poseId);
      if (index === -1) {
        favorites.push(poseId);
      } else {
        favorites.splice(index, 1);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      updateFavorites();
    }
  });

  function filterPoses() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedDifficulty = difficultySelect.value.toLowerCase();

    poseCards.forEach((card) => {
      const cardParent = card.parentElement;
      const title = card.querySelector(".card-title").textContent.toLowerCase();
      const description = card
        .querySelector(".card-text")
        .textContent.toLowerCase();
      const difficulty = cardParent.dataset.difficulty;

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        description.includes(searchTerm);

      const matchesDifficulty =
        !selectedDifficulty || difficulty === selectedDifficulty;

      cardParent.style.display =
        matchesSearch && matchesDifficulty ? "block" : "none";
    });

    // Hide category titles if no poses are visible in that category
    document.querySelectorAll(".category-title").forEach((title) => {
      const nextRow = title.nextElementSibling;
      const visiblePoses = nextRow.querySelectorAll(
        '.col-12[style="display: block"]'
      );
      title.style.display =
        visiblePoses.length > 0 || !selectedDifficulty ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterPoses);
  difficultySelect.addEventListener("change", filterPoses);

  // Initial update of favorites
  updateFavorites();
});
