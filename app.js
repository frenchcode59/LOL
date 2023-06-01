// Je crée mes constantes que j'utiliserai dans mon code
const gridElement = document.getElementById("grid");
const championStatsElement = document.getElementById("champion_stats");
const champions_url =
  "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json";
let list_champions = [];
const championsPerPage = 30;
let currentPage = 1;
let totalChampions;
let startIndex; // Index de départ pour la page actuelle
let endIndex; // Index de fin pour la page actuelle
let visibleChampions;

// Je fetch l'URL de l'API afin de récupérer la photo et les informations des champions
fetch(champions_url)
  .then((response) => response.json())
  .then((data) => {
    const champions = Object.values(data.data);
    list_champions = champions;
    totalChampions = champions.length;
    updateVisibleChampions();
    createPaginationButtons();
  })
  .catch((error) => {
    console.error(
      "Une erreur s'est produite lors de la récupération des champions :",
      error
    );
  });

// Fonction pour créer les boutons de pagination
function createPaginationButtons() {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = "";

  const previousButton = document.createElement("button");
  previousButton.innerText = "Précédent";
  previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateVisibleChampions();
    }
  });
  paginationElement.appendChild(previousButton);

  const nextButton = document.createElement("button");
  nextButton.innerText = "Suivant";
  nextButton.addEventListener("click", () => {
    const totalPages = Math.ceil(totalChampions / championsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateVisibleChampions();
    }
  });
  paginationElement.appendChild(nextButton);
}

// Fonction pour mettre à jour les champions visibles en fonction de la page actuelle
function updateVisibleChampions() {
  startIndex = (currentPage - 1) * championsPerPage;
  endIndex = startIndex + championsPerPage;
  visibleChampions = list_champions.slice(startIndex, endIndex);
  renderVisibleChampions();
}

// Fonction pour afficher les champions visibles dans la grille
function renderVisibleChampions() {
  gridElement.innerHTML = "";

  visibleChampions.forEach((champion) => {
    const championItem = document.createElement("div");
    championItem.classList.add("champion-item");

    const championImage = document.createElement("img");
    championImage.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${champion.image.full}`;

    const championName = document.createElement("div");
    championName.innerText = champion.name;

    championItem.appendChild(championImage);
    championItem.appendChild(championName);
    gridElement.appendChild(championItem);

    championImage.addEventListener("click", () => {
      // Efface le contenu précédent de l'écran des statistiques du champion
      championStatsElement.innerHTML = "";

      // Crée les éléments pour afficher les détails du champion
      const championTitle = document.createElement("h2");
      championTitle.innerText = champion.name;

      const championImageCopy = document.createElement("img");
      championImageCopy.src = championImage.src;

      // Ajoute les éléments à l'écran des statistiques du champion
      championStatsElement.appendChild(championTitle);
      championStatsElement.appendChild(championImageCopy);
    });
  });
}
