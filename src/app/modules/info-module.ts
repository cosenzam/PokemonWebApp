import { pokeNatures, pokeForms} from "../globals/global-constants";

// global vars
let formMap = new Map([
    ["alolan", "alola"],
    ["galarian", "galar"],
    ["hisuian", "hisui"],
    ["paldean", "paldea"],
]);

let lstPunctuation = [".", "'"];

// General Functions (non-page specific)
export function correctPokemonForms(pokeName : string){
    // pokemon with multiple forms such as Giratina have different valid request params e.g /pokemon/giratina-altered and /pokemon-species/giratina
    
    if (pokeForms.get(pokeName)){
        return pokeForms.get(pokeName);
    }
    else{
        return [pokeName, pokeName, capitalizeFirst(pokeName)];
    }
}

export function toHyphenFormat(name : string) : string{
    // correct names like mr. mime to mr-mime, mr. rime, chien pao to chien-pao, porygon z to porygon-z, jangmo-o line, farfetch'd, sirfetch'd
    // kyurem, deoxys, meowstic-male, meowstic-female, zygarde, hoopa, rotom, castform, tauros, basculin,
    // giratina, dialga, palkia, shaymin, darmanitan, genie legendaries, enamorus, keldeo, hoopa, meloetta, urshifu,
    // oricorio, lycanroc, wishiwashi, mimkyu, necrozma, cramorant, toxtricity, eiscue, indeedee, calyrex, oinkologne
    // palafin, gimmighoul, ogerpon, wormadam

    // special colors: minior, squawkabilly, maushold, tatsugiri, dudunsparce, gourgeist
    
    // remove punctuation
    let index = 0;
    for(let char of name){
        if(char == "("){ // remove parenthesis from datalist values
            name = name.slice(0, index - 1);
        }
        else if(lstPunctuation.includes(char)){
            name = name.replace(char, "");
        }
        index++;
    }

    let lstWords = name.split(" ");
    if(formMap.get(lstWords[0])){
        lstWords.push(`${formMap.get(lstWords[0])}`);
        lstWords.shift();
    }
    
    name = lstWords.join("-");
    return name;
}

export function removePunctuationCapitalize(name : string) : string{
    // remove hyphen and capitalize every word in string
    let lstWords = name.split("-");
    if(formMap.get(lstWords[0])){
        lstWords.push(`${formMap.get(lstWords[0])}`);
        lstWords.shift();
    }

    for(let [index, word] of lstWords.entries()){
        lstWords[index] = capitalizeFirst(word);
    }

    name = lstWords.join(" ");
    return name;
}

export function capitalizeFirst(name : string) : string{
    if (!(name.charCodeAt(0) > 47 && name.charCodeAt(0) < 58) ){
        name = name.charAt(0).toUpperCase() + name.slice(1)
    }
    return name;
}

// set css attributes depending on the pokemon types
export function setTypes(pokeTypes : string[], elTypeDiv: HTMLElement) {

    if (pokeTypes.length < 2){
        // remove type 2 bg if not dual type
        (<HTMLElement>elTypeDiv.querySelector("#type2"))!.style.cssText = "display: none;";
        elTypeDiv.querySelector("#type2")!.innerHTML = "";
    }
    else{
        (<HTMLElement>elTypeDiv.querySelector("#type2"))!.style.cssText = "display: inline-block;";
    }

    let i = 0; // shouldnt use a loop because there can only be 1 or 2 types, oh well
    while (i < pokeTypes.length){
        let element = "#type" + (i + 1)
        let type = pokeTypes[i];
        elTypeDiv.querySelector(element)!.setAttribute("class", `${type} type-container`);
        elTypeDiv.querySelector(element)!.innerHTML = pokeTypes[i].charAt(0).toUpperCase() + pokeTypes[i].slice(1);
        i++;
    }
}

export function autocompletePokedex(nationalPokedex : Map<any, any>){
    nationalPokedex.forEach((index: any, item: any) => {
        let elOption = document.createElement("option");
        elOption.setAttribute("label", "#" + index + ". ");
        elOption.setAttribute("value", correctPokemonForms(item)![2]);
        document.getElementById("pokemon-list")?.appendChild(elOption);
    });
}

//Search Functions
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

// ability name and tooltip for search
export function setAbilityTooltip(abilityName : string, abilityDescription : string = "", isLastIndex : boolean = false, slotNum : number = 0){
    let element = document.getElementById("poke-abilities");
    
    let elAbilityTooltip = document.createElement("span");
    /*
    if (!isLastIndex){ // not working every time because subscribe can return out of order/async! ****
        abilityTooltip.innerText = abilityName + ","; // using margin instead of spaces after each ","
    }
    else{ 
        abilityTooltip.innerText = abilityName;
    }
    */
    elAbilityTooltip.innerText = capitalizeFirst(abilityName); // not using commas for now
    elAbilityTooltip.setAttribute("class", "ability-tooltip");

    element!.appendChild(elAbilityTooltip);

    if (abilityDescription){
        let elAbilityTooltipText = document.createElement("span");
        elAbilityTooltipText.innerText = abilityDescription;
        elAbilityTooltipText.setAttribute("class", "ability-tooltip-text");
        elAbilityTooltip.appendChild(elAbilityTooltipText);
        elAbilityTooltipText.style.display = "flex";
        let tooltipMarginLeft = (-elAbilityTooltipText!.offsetWidth + elAbilityTooltip!.offsetWidth) / 2;
        elAbilityTooltipText.style.display = "none";
        elAbilityTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
    }

}

export function setPokedexEntry(entryDescription : string){
    const element = (<HTMLElement>document.getElementById("poke-pokedex-text"));
    element!.innerHTML = entryDescription;
}

// Pokedex Functions
export function createCard(pokeName : string, pokedexNumber : number, pokeTypes : string[], spriteURL : string) : HTMLElement {

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
    elPokemonName.innerText = capitalizeFirst(pokeName);

    //sprite
    let elWrapper2 = document.createElement("div");
    elWrapper2.setAttribute("class", "card-sprite-wrapper");
    
    let elSprite = document.createElement("img");
    elSprite.setAttribute("src", spriteURL);

    // type
    let elWrapper3 = document.createElement("div");

    let elTypeLabel = document.createElement("div");
    elTypeLabel.innerText = "Type:";

    let elTypeWrapper = document.createElement("div");
    elTypeWrapper.setAttribute("class", "types-wrapper");

    let elType1 = document.createElement("span");
    elType1.innerText = capitalizeFirst(pokeTypes[0]);
    elType1.setAttribute("class", `${pokeTypes[0]} type-container`);


    elCardHeader.appendChild(elPokedexNumber);
    elCardHeader.appendChild(elPokemonName);
    elWrapper.appendChild(elCardHeader);
    elCardInner.appendChild(elWrapper);

    elWrapper2.appendChild(elSprite);
    elCardInner.appendChild(elWrapper2);

    elTypeWrapper.appendChild(elType1);
    // add type2 if dual type
    if (pokeTypes.length == 2){
        let elType2 = document.createElement("span");
        elType2.innerText = capitalizeFirst(pokeTypes[1]);
        elType2.setAttribute("class", `${pokeTypes[1]} type-container`);
        elTypeWrapper.appendChild(elType2);
    }
    elWrapper3.appendChild(elTypeLabel);
    elWrapper3.appendChild(elTypeWrapper);
    elCardInner.appendChild(elWrapper3);

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

// Teams Functions
export function setAbilitiesTeams(abilityName : string, abilityDescription : string = "", slotNum : number){

    let elSelectAbility = document.getElementById(`slot-${slotNum}-abilities`);

    let elOption = document.createElement("option");
    elOption.text = capitalizeFirst(abilityName);
    elOption.value = abilityName;
    elSelectAbility!.appendChild(elOption);
}

export function setFrontSprite(response : any, elSpriteDiv : HTMLElement){
    let elSpriteDefault = <HTMLElement>elSpriteDiv!.querySelector("#sprite-default");
    elSpriteDefault!.setAttribute('src', response.sprites.front_default);
    elSpriteDefault!.style.cssText = "display:flex;justify-content:space-between;";

    let elSpriteShiny = <HTMLElement>elSpriteDiv!.querySelector("#sprite-shiny");
    elSpriteShiny!.setAttribute('src', response.sprites.front_shiny);
}

export function setNatures(elSlotDiv : any, slotNum : number){
    let elSelectAbility = document.getElementById(`slot-${slotNum}-natures`);
    for(let nature of pokeNatures.keys()){
        let option = document.createElement("option");
        option.text = capitalizeFirst(nature);
        option.value = nature;
        elSelectAbility!.appendChild(option);
    }
}

export function setAbilityTooltipTeams(abilityDescription : string = "", slotNum : number){
    let elAbilityTooltip = document.getElementById(`slot-${slotNum}-ability-tooltip`);
    let elAbilityTooltipText = <HTMLElement>elAbilityTooltip!.querySelector(".ability-tooltip-text");
    elAbilityTooltipText.innerText = abilityDescription;
    elAbilityTooltipText.style.display = "flex";
    let tooltipMarginLeft = (-elAbilityTooltipText!.offsetWidth + elAbilityTooltip!.offsetWidth) / 2;
    elAbilityTooltipText.style.display = "none";
    elAbilityTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
}

export function setNatureTooltipTeams(natureName : string = "", slotNum : number){
    let elNatureTooltip = document.getElementById(`slot-${slotNum}-nature-tooltip`);
    let elNatureTooltipText = <HTMLElement>elNatureTooltip!.querySelector(".nature-tooltip-text");
    elNatureTooltipText.innerText = `${pokeNatures.get(natureName)![0]} up, ${pokeNatures.get(natureName)![1]} down`;
    elNatureTooltipText.style.display = "flex";
    let tooltipMarginLeft = (-elNatureTooltipText!.offsetWidth + elNatureTooltip!.offsetWidth) / 2;
    elNatureTooltipText.style.display = "none";
    elNatureTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
}

export function setMoves(response: any, elMovesDiv : HTMLElement, slotNum : number){
    //console.log(response[0].moves);
    for (let [index, move] of response.moves.entries()){
        //console.log(move.move.name);
        // append all moves as options to all 4 select tags
        for(let i = 0; i <= 3; i++){

            let moveName = removePunctuationCapitalize(move.move.name);

            let elOption = document.createElement("option");
            elOption.text = capitalizeFirst(moveName);
            elOption.value = move.move.name;

            let elSelectMove = elMovesDiv.querySelector(`#slot-${slotNum}-move-${i + 1}`);
            elSelectMove!.appendChild(elOption);
        }      
    }
    // set tooltip margin
    for(let i = 0; i <= 3; i++){
        let elMoveTooltip = document.getElementById(`slot-${slotNum}-move-${i + 1}-tooltip`);
        let elMoveTooltipText = <HTMLElement>elMoveTooltip!.querySelector(".move-tooltip-text");
        elMoveTooltipText.style.display = "flex";
        let tooltipMarginLeft = (-elMoveTooltipText!.offsetWidth + elMoveTooltip!.offsetWidth) / 2;
        elMoveTooltipText.style.display = "none";
        elMoveTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
    }
}

export function setMoveTooltip(moveDescription : any, moveNum : number, slotNum : number){
    let elMoveTooltip = document.getElementById(`slot-${slotNum}-move-${moveNum}-tooltip`);
    let elMoveTooltipText = <HTMLElement>elMoveTooltip!.querySelector(".move-tooltip-text");
    let elTypeDiv = <HTMLElement>elMoveTooltipText.querySelector(".type-container");

    if (!moveDescription){
        elTypeDiv.innerText = "---";
        elTypeDiv.setAttribute("class", "type-container");
        (<HTMLElement>elMoveTooltipText.querySelector(".pp")).innerText = "---";
        (<HTMLElement>elMoveTooltipText.querySelector(".accuracy")).innerText = "---";
        (<HTMLElement>elMoveTooltipText.querySelector(".move-description")).innerText = "Description: ---";
    }
    else{
        elTypeDiv.innerText = capitalizeFirst(moveDescription.type.name);
        elTypeDiv.setAttribute("class", `type-container ${moveDescription.type.name}`);
        (<HTMLElement>elMoveTooltipText.querySelector(".pp")).innerText = moveDescription.pp;
        (<HTMLElement>elMoveTooltipText.querySelector(".accuracy")).innerText = moveDescription.accuracy + "%";
        //(<HTMLElement>elMoveTooltipText.querySelector(".move-description")).innerText = moveDescription.effect_entries[0].effect;
        (<HTMLElement>elMoveTooltipText.querySelector(".move-description")).innerText = "Description: " + moveDescription.effect_entries[0].short_effect;
    }
    elMoveTooltipText.style.display = "flex";
    let tooltipMarginLeft = (-elMoveTooltipText!.offsetWidth + elMoveTooltip!.offsetWidth) / 2;
    elMoveTooltipText.style.display = "none";
    elMoveTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
    
}

export function updateStats(nature : string, slotNum : number){
    
}