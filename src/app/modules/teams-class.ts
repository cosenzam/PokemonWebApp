// import general functions from info-module
import { capitalizeFirst, removePunctuationCapitalize } from "./info-module";
import { pokeNatures } from "../globals/global-constants";

export class Member{
    _pokeName : string;
    _apiResponse : any;
    _slotNum : number;
    _ability : string;
    _statsBase : number[];
    _statsAfterCalc : number[];
    _moves : string[];
    _nature : string;

    //constructor
    constructor(pokeName = "", apiResponse : any, slotNum : number, elDiv : any){
        this._pokeName = pokeName;
        this._apiResponse = apiResponse;
        this._slotNum = slotNum;
        this._ability = apiResponse.abilities[0].ability.name;
        this._statsBase = [apiResponse.stats[0].base_stat, apiResponse.stats[1].base_stat, apiResponse.stats[2].base_stat, apiResponse.stats[3].base_stat, apiResponse.stats[4].base_stat, apiResponse.stats[5].base_stat];
        this._statsAfterCalc = this._statsBase;
        this._moves = ["", "", "", ""];
        this.setMoves(apiResponse, elDiv);
        this._nature = "hardy";
        this.setNatures();
    }

    set slotNum(slotNum : number){
        this._slotNum = slotNum;
    }

    get slotNum() : number{
        return this._slotNum;
    }

    set ability(abilityName : string){
        this._ability = abilityName;
        this.updateAbilityTT(abilityName);
    }

    get ability() : string{
        return this._ability;
    }

    get statsBase() : number[]{
        return this._statsBase;
    }

    set nature(natureName : string){
        this._nature = natureName;
        this._statsAfterCalc = this.updateStats(natureName);
        this.updateNatureTT(natureName);
    }

    get nature() : string{
        return this._nature;
    }

    set statsAfterCalc(statsAfterCalc : number[]){
        this._statsAfterCalc = statsAfterCalc;
    }

    get statsAfterCalc() : number[]{
        return this._statsAfterCalc;
    }

    set moves(lstMove : any[]){
        // [moveNum (index), response]
        if (lstMove[0] >= 1 && lstMove[0] <= 4){
            this._moves[lstMove[0] - 1] = lstMove[1];
            this.updateMoveTT(lstMove[0], lstMove[1]);
        }
        else{
            console.log("invalid move #");
        }
    }

    get moves(){
        return this._moves;
    }

    //properties/functions
    private updateAbilityTT(abilityDescription : string = ""){
        let elAbilityTooltip = document.getElementById(`slot-${this.slotNum}-ability-tooltip`);
        let elAbilityTooltipText = <HTMLElement>elAbilityTooltip!.querySelector(".ability-tooltip-text");
        elAbilityTooltipText.innerText = abilityDescription;
        elAbilityTooltipText.style.display = "flex";
        let tooltipMarginLeft = (-elAbilityTooltipText!.offsetWidth + elAbilityTooltip!.offsetWidth) / 2;
        elAbilityTooltipText.style.display = "none";
        elAbilityTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
    }

    private updateMoveTT(moveNum : number, moveDescription : any){
        let elMoveTooltip = document.getElementById(`slot-${this.slotNum}-move-${moveNum}-tooltip`);
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

    private updateNatureTT(natureName : string){
        let elNatureTooltip = document.getElementById(`slot-${this.slotNum}-nature-tooltip`);
        let elNatureTooltipText = <HTMLElement>elNatureTooltip!.querySelector(".nature-tooltip-text");
        elNatureTooltipText.innerText = `${pokeNatures.get(natureName)![0]} up, ${pokeNatures.get(natureName)![1]} down`;
        elNatureTooltipText.style.display = "flex";
        let tooltipMarginLeft = (-elNatureTooltipText!.offsetWidth + elNatureTooltip!.offsetWidth) / 2;
        elNatureTooltipText.style.display = "none";
        elNatureTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
    }

    private updateStats(natureName : string) : number[]{
        // response.stats[0] - [5] and lstStatElements[0] - [5] = hp, atk, def, spatk, spdef, spd

        let statsAfterCalc : number[] = Array.from(this._statsBase);
        console.log(this._statsBase);
        // depending on nature edit base stats, * 0.1 to one, * -0.1 to another
        
        // aaaaaaaa switch or map idk
        // map would be more readable than switch

        if (!(pokeNatures.get(natureName)![0] === pokeNatures.get(natureName)![1])){
            for (let [index, stat] of pokeNatures.get(natureName)!.entries()){
                switch (stat){
                    case 'hp':
                        if (index === 0){
                            statsAfterCalc[0] = Math.floor(this._statsBase[0] + (this._statsBase[0] * 0.1));
                        }
                        else{
                            statsAfterCalc[0] = Math.floor(this._statsBase[0] + (this._statsBase[0] * -0.1));
                        }
                        console.log("hp " + this._statsBase[0], "hp " + statsAfterCalc[0]);
                        break;
                    case 'atk':
                        if (index === 0){
                            statsAfterCalc[1] = Math.floor(this._statsBase[1] + (this._statsBase[1] * 0.1));
                        }
                        else{
                            statsAfterCalc[1] = Math.floor(this._statsBase[1] + (this._statsBase[1] * -0.1));
                        }
                        console.log("atk " + this._statsBase[1], "atk " + statsAfterCalc[1]);
                        break;
                    case 'def':
                        if (index === 0){
                            statsAfterCalc[2] = Math.floor(this._statsBase[2] + (this._statsBase[2] * 0.1));
                        }
                        else{
                            statsAfterCalc[2] = Math.floor(this._statsBase[2] + (this._statsBase[2] * -0.1));
                        }
                        console.log("def " + this._statsBase[2], "def " + statsAfterCalc[2]);
                        break;
                    case 'spatk':
                        if (index === 0){
                            statsAfterCalc[3] = Math.floor(this._statsBase[3] + (this._statsBase[3] * 0.1));
                        }
                        else{
                            statsAfterCalc[3] = Math.floor(this._statsBase[3] + (this._statsBase[3] * -0.1));
                        }
                        console.log("spatk " + this._statsBase[3], "spatk " + statsAfterCalc[3]);
                        break;
                    case 'spdef':
                        if (index === 0){
                            statsAfterCalc[4] = Math.floor(this._statsBase[4] + (this._statsBase[4] * 0.1));
                        }
                        else{
                            statsAfterCalc[4] = Math.floor(this._statsBase[4] + (this._statsBase[4] * -0.1));
                        }
                        console.log("spdef " + this._statsBase[4], "spdef " + statsAfterCalc[4]);
                        break;
                    case 'spd':
                        if (index === 0){
                            statsAfterCalc[5] = Math.floor(this._statsBase[5] + (this._statsBase[5] * 0.1));
                        }
                        else{
                            statsAfterCalc[5] = Math.floor(this._statsBase[5] + (this._statsBase[5] * -0.1));
                        }
                        console.log("spd " + this._statsBase[5], "spd " + statsAfterCalc[5]);
                        break;
                    default:
                        console.log('yikes');
                }
            }
        }

        var elStats = document.getElementById(`slot-${this.slotNum}-stats`);
        let lstStatElements = [];
        lstStatElements.push(elStats!.querySelector(".stat-hp"));
        lstStatElements.push(elStats!.querySelector(".stat-atk"));
        lstStatElements.push(elStats!.querySelector(".stat-def"));
        lstStatElements.push(elStats!.querySelector(".stat-spatk"));
        lstStatElements.push(elStats!.querySelector(".stat-spdef"));
        lstStatElements.push(elStats!.querySelector(".stat-spd"));
        // reset or change margins if necessary
        for (let i = 0; i <= 5; i++){
            if (statsAfterCalc[i] >= 15){
                (<HTMLElement>lstStatElements[i]!.children[1].children[0]).style.cssText = "margin-right:0px;";
            } 
            else if (statsAfterCalc[i] >= 10){
                (<HTMLElement>lstStatElements[i]!.children[1].children[0]).style.cssText = "margin-right:-20px;";
            }
            else{
                (<HTMLElement>lstStatElements[i]!.children[1].children[0]).style.cssText = "margin-right:-15px;";
            }
        }
        // Change to a percent scale (instead of px) relative to its parent to ensure streching and shrinking
        // calc((${response.stats[0].base_stat}/255) * 100%)
        (<HTMLElement>lstStatElements[0]!.children[1]).style.width = `calc((${statsAfterCalc[0]}/255) * 100%)`;
        (<HTMLElement>lstStatElements[0]!.children[1].children[0]).innerText = `${statsAfterCalc[0]}`;
    
        (<HTMLElement>lstStatElements[1]!.children[1]).style.width = `calc((${statsAfterCalc[1]}/255) * 100%)`;
        (<HTMLElement>lstStatElements[1]!.children[1].children[0]).innerText = `${statsAfterCalc[1]}`;
    
        (<HTMLElement>lstStatElements[2]!.children[1]).style.width = `calc((${statsAfterCalc[2]}/255) * 100%)`;
        (<HTMLElement>lstStatElements[2]!.children[1].children[0]).innerText = `${statsAfterCalc[2]}`;
    
        (<HTMLElement>lstStatElements[3]!.children[1]).style.width = `calc((${statsAfterCalc[3]}/255) * 100%)`;
        (<HTMLElement>lstStatElements[3]!.children[1].children[0]).innerText = `${statsAfterCalc[3]}`;
    
        (<HTMLElement>lstStatElements[4]!.children[1]).style.width = `calc((${statsAfterCalc[4]}/255) * 100%)`;
        (<HTMLElement>lstStatElements[4]!.children[1].children[0]).innerText = `${statsAfterCalc[4]}`;
        
        (<HTMLElement>lstStatElements[5]!.children[1]).style.width = `calc((${statsAfterCalc[5]}/255) * 100%)`;
        (<HTMLElement>lstStatElements[5]!.children[1].children[0]).innerText = `${statsAfterCalc[5]}`;

        return statsAfterCalc;
        
    }
    private setMoves(response: any, elDiv : HTMLElement){
        let elMovesDiv = <HTMLElement>elDiv!.querySelector("#poke-moves")
        //console.log(response[0].moves);
        for (let [index, move] of response.moves.entries()){
            //console.log(move.move.name);
            // append all moves as options to all 4 select tags
            for(let i = 0; i <= 3; i++){
    
                let moveName = removePunctuationCapitalize(move.move.name);
    
                let elOption = document.createElement("option");
                elOption.text = capitalizeFirst(moveName);
                elOption.value = move.move.name;
    
                let elSelectMove = elMovesDiv.querySelector(`#slot-${this.slotNum}-move-${i + 1}`);
                elSelectMove!.appendChild(elOption);
            }      
        }
        // set tooltip margin
        for(let i = 0; i <= 3; i++){
            let elMoveTooltip = document.getElementById(`slot-${this.slotNum}-move-${i + 1}-tooltip`);
            let elMoveTooltipText = <HTMLElement>elMoveTooltip!.querySelector(".move-tooltip-text");
            elMoveTooltipText.style.display = "flex";
            let tooltipMarginLeft = (-elMoveTooltipText!.offsetWidth + elMoveTooltip!.offsetWidth) / 2;
            elMoveTooltipText.style.display = "none";
            elMoveTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
        }
    }

    private setNatures(){
        let elSelectAbility = <HTMLSelectElement>document.getElementById(`slot-${this.slotNum}-natures`);
        for(let nature of pokeNatures.keys()){
            let option = document.createElement("option");
            option.text = capitalizeFirst(nature);
            option.value = nature;
            elSelectAbility!.appendChild(option);
        }
        elSelectAbility!.selectedIndex = 0; // reset upon new submit
    }

}