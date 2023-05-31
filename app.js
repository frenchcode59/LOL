// je creer mes constantes que j'utiliserai dans mon code

const gridElement = document.getElementById("grid");
const champions_url =
  "http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json";
const list_champions = [];

// je fetch l'url de l'api afin de recuperer la photos et les informations des champions

fetch("http://ddragon.leagueoflegends.com/cdn/13.10.1/data/fr_FR/champion.json")
  .then((response) => response.json())
  .then((data) => {
    const champions = Object.values(data.data);
    console.log(list_champions);

    champions.forEach((champion) => {
      const championItem = document.createElement("div");
      championItem.classList.add("champion-item");
      list_champions.push(champion);

      const championImage = document.createElement("img");
      championImage.src = `http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${champion.image.full}`;

      const championName = document.createElement("div");
      championName.innerText = champion.name;

      championItem.appendChild(championImage);
      championItem.appendChild(championName);
      gridElement.appendChild(championItem);
    });
  })
  .catch((error) => {
    console.error(
      "Une erreur s'est produite lors de la récupération des champions :",
      error
    );
  });
