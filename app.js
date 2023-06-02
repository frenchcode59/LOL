// Je cree mes constante et mes variables 

const gridElement = document.getElementById("grid");
const championStatsElement = document.getElementById("champion_stats");
const champions_url =
  "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json";
let list_champions = [];
const championsPerPage = 30;
const searchInput = document.getElementById("searchBar");
let currentPage = 1;
let totalChampions;
let startIndex;
let endIndex;
let visibleChampions;

//je fetch l'url pour recuperer l'image de mes champions et les transforme en format JSON

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

  //je cree une fonction avec des boutons me permettant de naviguer entre les champions 

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

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredChampions = list_champions.filter((champion) =>
    champion.name.toLowerCase().includes(searchTerm)
  );
  totalChampions = filteredChampions.length;
  currentPage = 1;
  updateVisibleChampions(filteredChampions);
  createPaginationButtons();
});

function updateVisibleChampions(champions = list_champions) {
  startIndex = (currentPage - 1) * championsPerPage;
  endIndex = startIndex + championsPerPage;
  visibleChampions = champions.slice(startIndex, endIndex);
  fetchChampionDetails();
}

function fetchChampionDetails() {
  const championDetailsPromises = visibleChampions.map((champion) => {
    const championDetailsUrl = `http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion/${champion.id}.json`;
    return fetch(championDetailsUrl).then((response) => response.json());
  });

  Promise.all(championDetailsPromises)
    .then((championDetails) => {
      visibleChampions.forEach((champion, index) => {
        champion.presentation = championDetails[index].data[champion.id].blurb;
      });
      renderVisibleChampions();
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des détails des champions :",
        error
      );
    });
}

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
      championStatsElement.innerHTML = "";

      const championTitle = document.createElement("h2");
      championTitle.innerText = champion.name;

      const championImageCopy = document.createElement("img");
      championImageCopy.src = championImage.src;

      const championPresentation = document.createElement("p");
      championPresentation.innerText = champion.presentation;

      championStatsElement.appendChild(championTitle);
      championStatsElement.appendChild(championImageCopy);
      championStatsElement.appendChild(championPresentation);
    });
  });
}
