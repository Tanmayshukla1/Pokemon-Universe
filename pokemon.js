let SelectBox = document.getElementById("select-box")
let SearchBox = document.getElementById("search-box")
let container = document.getElementById("container")
let pokemonarr = [];
let offset = 0;
let limit = 20;
let text = document.getElementById("text");
let loadBtn = document.getElementById("loadbtn");


let url = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"

window.addEventListener("load", async () => {
  const window_url = await loadpokemon(url)
  console.log(window_url);
  pokemonarr = window_url;
  showpokemon(window_url);

})
async function loadpokemon(element) {
  const response = await fetch(element)
  const result = await response.json();

  const promised = result.results.map(async (object) => {
    const pokemondata = await fetch(object.url);
    return pokemondata.json();

  });
  return await Promise.all(promised);

}

function showpokemon(pokemon) {
  container.innerHTML = "";
  pokemon.forEach(poki => {
    const allpokemon = document.createElement("div");
    allpokemon.classList.add("PokemonPoster");

    const allimages = document.createElement("img");
    allimages.classList.add("PokemonImage");
    allimages.src = poki.sprites.other.dream_world.front_default;

    const allname = document.createElement("h1");
    allname.classList.add("PokemonName");
    allname.innerText = poki.name

    const allTypes = document.createElement("h3");
    allTypes.classList.add("PokemonType")
    allTypes.innerText = poki.types.map(typeInfo => typeInfo.type.name).join(",");


    allpokemon.append(allimages, allname, allTypes);

    container.append(allpokemon);
  });
}


async function poketype() {
  let response = await fetch("https://pokeapi.co/api/v2/type/?limit=21");
  let data = await response.json();


  let defaultOption = document.createElement("option");
  defaultOption.value = "All types";
  defaultOption.innerText = "All types";
  SelectBox.append(defaultOption);

 
  data.results.forEach((types) => {
    let option = document.createElement("option");
    option.value = types.name;
    option.innerText = types.name;
    SelectBox.append(option);
  });
}
poketype();


SelectBox.addEventListener("change",PokemonDisplay);
function PokemonDisplay(e){
  let findtype =e.target.value;


  if(findtype==="All types"){
    showpokemon(pokemonarr);
    return;
  }
  const checkpokemon = pokemonarr.filter((pokemon) =>
    pokemon.types.some((typeInfo) => typeInfo.type.name === findtype)
);
showpokemon(checkpokemon);

}

SearchBox.addEventListener("input",(e)=>{
  let search = e.target.value;
  let searchpoke=pokemonarr.filter(pokemon=>
    pokemon.name.includes(search)
  );
  showpokemon(searchpoke);
});

loadBtn.addEventListener("click",addpokemon);
async function addpokemon(){
  container.innerHTML="";
  text.textContent="Loading...";
  offset = limit + offset;
  let newUrl = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;
  const newData = await loadpokemon(newUrl);
  text.textContent = "";
  pokemonarr=pokemonarr.concat(newData);
  showpokemon(pokemonarr);
}

