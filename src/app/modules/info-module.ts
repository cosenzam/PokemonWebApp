import { pokeNatures, pokeForms} from "../globals/global-constants";

export function setSprites(response : any) {
    // prevent invalid images from entering document
    /* can shorten with Map(["front-Sprite", response.sprites.front_default], ["back-Sprite", response.sprites.back_default]...)
    then loop map and set sprites | for (let [key, val] of spriteMap) || maybe a similar solution with lists?*/
    if (response.sprites.front_default){
        document.getElementById("front-Sprite")!.setAttribute('src', response.sprites.front_default);
    }
    else{
        console.log("No front default sprite");
        document.getElementById("front-Sprite")!.setAttribute('src', '');
    }

    if (response.sprites.back_default){
        document.getElementById("back-Sprite")!.setAttribute('src', response.sprites.back_default);
    }
    else{
        console.log("No back default sprite");
        document.getElementById("back-Sprite")!.setAttribute('src', '');
    }
    
    if (response.sprites.front_shiny){
        document.getElementById("front-Shiny")!.setAttribute('src', response.sprites.front_shiny);
    }
    else{
        console.log("No front shiny sprite");
        document.getElementById("front-Shiny")!.setAttribute('src', '');
    }

    if (response.sprites.back_shiny){
        document.getElementById("back-Shiny")!.setAttribute('src', response.sprites.back_shiny);
    }
    else{
        console.log("No back shiny sprite");
        document.getElementById("back-Shiny")!.setAttribute('src', '');
    }

    // if both sprites are missing, do not show sprites div
    if (!response.sprites.front_default && !response.sprites.back_default){
        document.getElementById("sprites-1")!.style.cssText = "display:none;";
    }
    else{
        document.getElementById("sprites-1")!.style.cssText = "display:inline-block;";
    }
    if (!response.sprites.front_shiny && !response.sprites.back_shiny){
        document.getElementById("sprites-2")!.style.cssText = "display:none;";
    }
    else{
        document.getElementById("sprites-2")!.style.cssText = "display:inline-block;";
    }
}

export function setFrontSprite(response : any, element : string){
    document.getElementById("front-Sprite")!.setAttribute('src', response.sprites.front_default);
    document.getElementById(element)!.style.cssText = "display:flex;justify-content:space-between;";
}

// set css attributes depending on the pokemon types
export function setTypes(pokeTypes : string[]) {

    if (pokeTypes.length < 2){
        // remove type 2 bg if not dual type
        document.getElementById("type2")!.style.cssText = "display: none;";
        document.getElementById("type2")!.innerHTML = "";
    }
    else{
        document.getElementById("type2")!.style.cssText = "display: inline-block;";
    }

    let i = 0; // shouldnt use a loop because there can only be 1 or 2 types, oh well
    while (i < pokeTypes.length){
        let element = "type" + (i + 1)
        let type = pokeTypes[i];

        try{ 
            document.getElementById(element)!.setAttribute("class", `${type} type-container`);
            document.getElementById(element)!.innerHTML = pokeTypes[i].charAt(0).toUpperCase() + pokeTypes[i].slice(1); 
        }
        catch{ console.log("not a valid type") ;}
        i++;
    }
}

// response.stats[0] - [5] and lstStatElements[0] - [5] = hp, atk, def, spatk, spdef, spd
export function setStats(response : any, route : string, slotNum : number = 0){
    if (route == "search"){ 
        var elStats = document.getElementById("stats");
    }
    else if(route == "teams"){ 
        var elStats = document.getElementById(`slot-${slotNum}-stats`);
    }
    let lstStatElements = [];
    lstStatElements.push(elStats!.querySelector(".stat-hp"));
    lstStatElements.push(elStats!.querySelector(".stat-atk"));
    lstStatElements.push(elStats!.querySelector(".stat-def"));
    lstStatElements.push(elStats!.querySelector(".stat-spatk"));
    lstStatElements.push(elStats!.querySelector(".stat-spdef"));
    lstStatElements.push(elStats!.querySelector(".stat-spd"));
    // reset or change margins if necessary
    for (let i = 0; i <= 5; i++){
        if (response.stats[i].base_stat >= 15){
            (<HTMLElement>lstStatElements[i]!.children[1].children[0]).style.cssText = "margin-right:0px;";
        } 
        else if (response.stats[i].base_stat >= 10){
            (<HTMLElement>lstStatElements[i]!.children[1].children[0]).style.cssText = "margin-right:-20px;";
        }
        else{
            (<HTMLElement>lstStatElements[i]!.children[1].children[0]).style.cssText = "margin-right:-15px;";
        }
    }
    // Change to a percent scale (instead of px) relative to its parent to ensure streching and shrinking
    // calc((${response.stats[0].base_stat}/255) * 100%)
    (<HTMLElement>lstStatElements[0]!.children[1]).style.width = `calc((${response.stats[0].base_stat}/255) * 100%)`;
    (<HTMLElement>lstStatElements[0]!.children[1].children[0]).innerText = `${response.stats[0].base_stat}`;

    (<HTMLElement>lstStatElements[1]!.children[1]).style.width = `calc((${response.stats[1].base_stat}/255) * 100%)`;
    (<HTMLElement>lstStatElements[1]!.children[1].children[0]).innerText = `${response.stats[1].base_stat}`;

    (<HTMLElement>lstStatElements[2]!.children[1]).style.width = `calc((${response.stats[2].base_stat}/255) * 100%)`;
    (<HTMLElement>lstStatElements[2]!.children[1].children[0]).innerText = `${response.stats[2].base_stat}`;

    (<HTMLElement>lstStatElements[3]!.children[1]).style.width = `calc((${response.stats[3].base_stat}/255) * 100%)`;
    (<HTMLElement>lstStatElements[3]!.children[1].children[0]).innerText = `${response.stats[3].base_stat}`;

    (<HTMLElement>lstStatElements[4]!.children[1]).style.width = `calc((${response.stats[4].base_stat}/255) * 100%)`;
    (<HTMLElement>lstStatElements[4]!.children[1].children[0]).innerText = `${response.stats[4].base_stat}`;
    
    (<HTMLElement>lstStatElements[5]!.children[1]).style.width = `calc((${response.stats[5].base_stat}/255) * 100%)`;
    (<HTMLElement>lstStatElements[5]!.children[1].children[0]).innerText = `${response.stats[5].base_stat}`;
}

export function selectAbilities(pokeAbilities : string[], slotNum : number){
    // for each ability, append a child option to select tag
    const element = (<HTMLElement>document.querySelector(`.slot-${slotNum}-abilities`));
    if (element.hasChildNodes()){
        // remove ALL child nodes
        element.innerHTML = "";
    }

    for (let ability of pokeAbilities){
        // append options to select for each ability
        let option = document.createElement("option");
        option.text = ability;
        option.value = ability;
        element.appendChild(option);
    }

}

export function setAbilityTooltip(abilityName : string, abilityDescription : string = "", isLastIndex : boolean = false, slotNum : number = 0){
    const element = document.getElementById("poke-abilities");
    abilityName = abilityName.charAt(0).toUpperCase() + abilityName.slice(1);
    
    let abilityTooltip = document.createElement("span");
    /*
    if (!isLastIndex){ // not working every time because subscribe can return out of order/async! ****
        abilityTooltip.innerText = abilityName + ","; // using margin instead of spaces after each ","
    }
    else{ 
        abilityTooltip.innerText = abilityName;
    }
    */
    abilityTooltip.innerText = abilityName; // not using commas for now
    abilityTooltip.setAttribute("class", "ability-tooltip");

    element!.appendChild(abilityTooltip);
    // calculate abilityTooltipText's margin-left to center tooltip under parent
    let tooltipMarginLeft = -100 + (abilityTooltip.offsetWidth / 2);

    if (abilityDescription){
        let abilityTooltipText = document.createElement("span");
        abilityTooltipText.innerText = abilityDescription;
        abilityTooltipText.setAttribute("class", "ability-tooltip-text");
        abilityTooltip.appendChild(abilityTooltipText);
        abilityTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
    }

}

export function setPokedexEntry(entryDescription : string){
    const element = (<HTMLElement>document.getElementById("poke-pokedex-text"));
    element!.innerHTML = entryDescription;
}

export function createCard(pokeName : string, pokedexNumber : number, pokeTypes : string[], spriteURL : string) : HTMLElement {
    // wrapper1 2 and 3 appended to elCardInner, elCard Inner appended to elCard
    let elCard = document.createElement("div");
    elCard.setAttribute("class", `card ${pokeTypes[0]}`);

    let elCardInner = document.createElement("div");
    elCardInner.setAttribute("class", "card-inner");
    
    // pokedex num and name
    let elWrapper = document.createElement("div");

    let elCardHeader = document.createElement("div");
    elCardHeader.setAttribute("class", "card-header-cyan");

    let elPokedexNumber = document.createElement("span");
    elPokedexNumber.innerText = "#" + pokedexNumber.toString();

    let elPokemonName = document.createElement("span");
    elPokemonName.innerText = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

    //sprite
    let elWrapper2 = document.createElement("div");
    elWrapper2.setAttribute("class", "card-sprite-wrapper");
    
    let elSprite = document.createElement("img");
    elSprite.setAttribute("src", spriteURL);

    // type
    let elWrapper3 = document.createElement("div");

    let elTypeLabel = document.createElement("div");
    elTypeLabel.innerText = "Types:";

    let elTypeWrapper = document.createElement("div");
    elTypeWrapper.setAttribute("class", "types-wrapper");

    let elType1 = document.createElement("span");
    elType1.innerText = pokeTypes[0].charAt(0).toUpperCase() + pokeTypes[0].slice(1);
    elType1.setAttribute("class", `${pokeTypes[0]} type-container`);

    // append header to card inner
    elCardHeader.appendChild(elPokedexNumber);
    elCardHeader.appendChild(elPokemonName);
    elWrapper.appendChild(elCardHeader);
    elCardInner.appendChild(elWrapper);
    // append front sprite to card inner
    elWrapper2.appendChild(elSprite);
    elCardInner.appendChild(elWrapper2);
    // append types wrapper to card inner
    elTypeWrapper.appendChild(elType1);
    // add type2 if dual type
    if (pokeTypes.length == 2){
        let elType2 = document.createElement("span");
        elType2.innerText = pokeTypes[1].charAt(0).toUpperCase() + pokeTypes[1].slice(1);
        elType2.setAttribute("class", `${pokeTypes[1]} type-container`);
        elTypeWrapper.appendChild(elType2);
    }
    elWrapper3.appendChild(elTypeLabel);
    elWrapper3.appendChild(elTypeWrapper);
    elCardInner.appendChild(elWrapper3);
    // append card inner to card
    elCard.appendChild(elCardInner);

    return elCard;

    /*
    <div class="card"> | elCard
        <div class="card-inner"> | elCardInner
            <div> elWrapper
                <div class="card-header-cyan"> | elCardHeader
                    <span>#1</span> | elPokdexNumber
                    <span>Bulbasaur</span> | elPokemonName
                </div>
            </div>

            <div class="card-sprite-wrapper"> | elWrapper2
                <img src="../assets/images/1200px-DP142.png"> | elSprite
            </div>

            <div> | elWrapper3
                <div>Type:</div> | elTypeLabel
                <div class="types-wrapper"> | elTypeWrapper
                    <span class="type-container grass">Grass</span> | elType1
                    <span class="type-container poison">Poison</span> | elType2
                </div>
            </div>
        </div>
    </div>
    */
}

export function correctPokemonForms(pokeName : string){
    // pokemon with multiple forms such as Giratina have different valid request params e.g /pokemon/giratina-altered and /pokemon-species/giratina
    // this will allow for requesting for both general pokemon info and pokedex entries
    // key = user input, value = ["pokeName", "pokeSpeciesName"]
    if (pokeForms.get(pokeName)){
        return pokeForms.get(pokeName);
    }
    else{
        return [pokeName, pokeName];
    }
}

export function setTeamsSprites(response : any){
    return
}

export function toggleShiny(){
    return
}