const cardList = document.querySelector(".card-list");

const limit = 10;
let currentPage = 1;

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatId(id) {
  if (id < 10) {
    return `0${id}`;
  }
  return `${id}`;
}

function addSprite(card, sprite, name) {
  const img = document.createElement("img");
  img.className = "sprite";
  img.src = sprite;
  img.alt = name;

  card.appendChild(img);
}

function addHeader(card, name, id) {
  const header = document.createElement("h2");
  header.className = "card-heading";
  const pokeId = formatId(id);
  const pokemonName = capitalize(name);
  const text = document.createTextNode(`${pokeId}. ${pokemonName}`);
  header.appendChild(text);
  card.appendChild(header);
}

function addTypes(card, types) {
  const section = document.createElement("section");
  section.className = "card-types";

  const h3 = document.createElement("h3");
  h3.className = "card-types-header";
  const typesHeader = document.createTextNode("Type");
  h3.appendChild(typesHeader);

  const p = document.createElement("p");
  p.className = "card-types-text";

  let typesString = "";
  types.forEach((type, index) => {
    const pokeType =
      index === types.length - 1
        ? `${capitalize(type.type.name)}`
        : ` ${capitalize(type.type.name)}, `;
    typesString += pokeType;
  });

  const text = document.createTextNode(typesString);
  p.appendChild(text);

  section.appendChild(h3);
  section.appendChild(p);

  card.appendChild(section);
}

function addStats(card, stats) {
  const section = document.createElement("section");
  section.className = "card-stats";

  const h3 = document.createElement("h3");
  h3.className = "card-stats-header";
  const statsHeader = document.createTextNode("Base Stats");
  h3.appendChild(statsHeader);

  const statsContainer = document.createElement("div");
  statsContainer.className = "card-stats-options";

  stats.forEach((stat) => {
    const p = document.createElement("p");
    p.className = "card-stats-option";

    const statName = capitalize(stat.stat.name);
    const text = `${statName}: ${stat.base_stat}`;

    const textNode = document.createTextNode(text);
    p.appendChild(textNode);
    statsContainer.appendChild(p);
  });

  section.appendChild(h3);
  section.appendChild(statsContainer);

  card.appendChild(section);
}

function createPokemonCard(data) {
  const card = document.createElement("article");
  card.className = "pokemon-card";

  addSprite(card, data.sprites.front_default, data.name);
  addHeader(card, data.name, data.id);
  addTypes(card, data.types);
  addStats(card, data.stats);

  return card;
}

function addToDOM(card) {
  cardList.appendChild(card);
}

const getCard = async (id) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  const data = await response.json();

  const card = createPokemonCard(data);
  addToDOM(card);
};

const getPage = async (page, limit) => {
  const end = page * limit;
  const start = end - 9;
  for (let i = start; i <= end; i++) {
    await getCard(i);
  }
};

getPage(1, 10);

addEventListener(
  "scroll",
  () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      currentPage++;
      getPage(currentPage, 10);
    }
  },
  { passive: true }
);
