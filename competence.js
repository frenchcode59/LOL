const gridDeuxElement = document.getElementById("grid-deux");
const itemsStatsElement = document.getElementById("items_stats");
const itemsUrl =
  "https://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/item.json";
let itemList = [];
const itemsPerPage = 30;
let currentPage = 1;
let startIndex;
let endIndex;
let visibleItems;

fetch(itemsUrl)
  .then((response) => response.json())
  .then((data) => {
    const items = Object.values(data.data);
    itemList = items;
    updateVisibleItems();
    createPaginationButtons();
  })
  .catch((error) => {
    console.error(
      "Une erreur s'est produite lors de la récupération des items :",
      error
    );
  });

function createPaginationButtons() {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = "";

  const totalPages = Math.ceil(itemList.length / itemsPerPage);

  const previousButton = document.createElement("button");
  previousButton.innerText = "Précédent";
  previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateVisibleItems();
    }
  });
  paginationElement.appendChild(previousButton);

  const nextButton = document.createElement("button");
  nextButton.innerText = "Suivant";
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateVisibleItems();
    }
  });
  paginationElement.appendChild(nextButton);
}

function updateVisibleItems() {
  startIndex = (currentPage - 1) * itemsPerPage;
  endIndex = startIndex + itemsPerPage;
  visibleItems = itemList.slice(startIndex, endIndex);
  renderItems();
}

function renderItems() {
  gridDeuxElement.innerHTML = "";

  visibleItems.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("item");

    const itemImage = document.createElement("img");
    itemImage.src = `https://ddragon.leagueoflegends.com/cdn/13.10.1/img/item/${item.image.full}`;

    const itemName = document.createElement("div");
    itemName.innerText = item.name;

    itemElement.appendChild(itemImage);
    itemElement.appendChild(itemName);
    gridDeuxElement.appendChild(itemElement);

    itemElement.addEventListener("click", () => {
      itemsStatsElement.innerHTML = "";

      const itemTitle = document.createElement("h2");
      itemTitle.innerText = item.name;

      const itemDescription = document.createElement("p");
      itemDescription.innerText = item.description;

      const itemImageElement = document.createElement("img");
      itemImageElement.src = itemImage.src;

      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item-container");
      itemContainer.appendChild(itemImageElement);
      itemContainer.appendChild(itemTitle);
      itemContainer.appendChild(itemDescription);

      itemsStatsElement.innerHTML = "";
      itemsStatsElement.appendChild(itemContainer);
    });
  });
}

updateVisibleItems();
createPaginationButtons();
