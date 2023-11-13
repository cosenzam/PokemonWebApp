// reponse variable is of <Pokemon> interface type

export function displaySprites(response: any) {
    document.getElementById("front-Sprite")!.setAttribute('src', response.sprites.front_default);
    document.getElementById("back-Sprite")!.setAttribute('src', response.sprites.back_default);
    document.getElementById("front-Shiny")!.setAttribute('src', response.sprites.front_shiny);
    document.getElementById("back-Shiny")!.setAttribute('src', response.sprites.back_shiny);
    document.getElementById("sprites-1")!.style.cssText = "display:flex;justify-content:space-around;";
    document.getElementById("sprites-2")!.style.cssText = "display:flex;justify-content:space-around;";
}

export function displayFrontSprite(response: any, element: string){
    document.getElementById("front-Sprite")!.setAttribute('src', response.sprites.front_default);
    document.getElementById(element)!.style.cssText = "display:flex;justify-content:space-between;";
}

// set css attributes depending on the pokemon types
export function displayTypes(pokeTypes: string[]) {

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
            document.getElementById(element)!.setAttribute('class', `${type} type-container`);
            document.getElementById(element)!.innerHTML = pokeTypes[i].charAt(0).toUpperCase() + pokeTypes[i].slice(1); 
        }
        catch{ console.log("not a valid type") ;}
        i++;
    }
}

export function displayTeamsSprites(response: any){
    return
}

export function toggleShiny(){
    return
}

export function autocompleteMoves(){
    
}

// can use on any page with a stats div
export function displayStats(response: any, route: string, slotNum: number = 0){
    if (route == "search"){ 
        var element = document.getElementById("stats");
    }
    else if(route == "teams"){ 
        var element = document.getElementById(`slot-${slotNum}-stats`);
    }

    (<HTMLElement>element!.querySelector(".stat-hp")!.children[0]).innerText = `HP: ${response.stats[0].base_stat}`;
    (<HTMLElement>element!.querySelector(".stat-hp")!.children[1]).style.width = `${response.stats[0].base_stat}px`;
    (<HTMLElement>element!.querySelector(".stat-atk")!.children[0]).innerText = `Attack: ${response.stats[1].base_stat}`;
    (<HTMLElement>element!.querySelector(".stat-atk")!.children[1]).style.width = `${response.stats[1].base_stat}px`;
    (<HTMLElement>element!.querySelector(".stat-def")!.children[0]).innerText = `Defense: ${response.stats[2].base_stat}`;
    (<HTMLElement>element!.querySelector(".stat-def")!.children[1]).style.width = `${response.stats[2].base_stat}px`;
    (<HTMLElement>element!.querySelector(".stat-spatk")!.children[0]).innerText = `Special Attack: ${response.stats[3].base_stat}`;
    (<HTMLElement>element!.querySelector(".stat-spatk")!.children[1]).style.width = `${response.stats[3].base_stat}px`;
    (<HTMLElement>element!.querySelector(".stat-spdef")!.children[0]).innerText = `Special Defense: ${response.stats[4].base_stat}`;
    (<HTMLElement>element!.querySelector(".stat-spdef")!.children[1]).style.width = `${response.stats[4].base_stat}px`;
    (<HTMLElement>element!.querySelector(".stat-spd")!.children[0]).innerText = `Speed: ${response.stats[5].base_stat}`;
    (<HTMLElement>element!.querySelector(".stat-spd")!.children[1]).style.width = `${response.stats[5].base_stat}px`;
}

export function selectAbilities(pokeAbilities: string[], slotNum: number){
    // for each ability, append a child option to select tag
    const element = (<HTMLElement>document.querySelector(`.slot-${slotNum}-abilities`));
    if (element.hasChildNodes()){
        // remove ALL child nodes
        element.innerHTML = "";
    }
    // append options to select for each ability
    var option = document.createElement("option");
    option.text = "first option";
    option.value = "first option value";
    element.appendChild(option);
}