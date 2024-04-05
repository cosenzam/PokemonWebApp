// import general functions from info-module
import { capitalizeFirst } from "./info-module";
import { pokeNatures } from "../globals/global-constants";


// create class 
// class object for each team slot
// will help to keep state for things like currently selected move in slots, current tooltip move and desc
// init/constructor will call all teams functions, constructor params will be api request(s)
// keep base stat values to calculate natures

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
    constructor(pokeName = "", apiResponse : any, slotNum : number){
        this._pokeName = pokeName;
        this._apiResponse = apiResponse;
        this._slotNum = slotNum;
        this._ability = apiResponse.abilities[0].ability.name;
        this._statsBase = []; // stats = apiResponse.stats whatever stuff
        this._statsAfterCalc = this._statsBase; // hardy nature by default, so just copy statsBase
        this._moves = ["", "", "", ""];
        this._nature = "hardy";
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
        // [moveNum (index) , moveName, moveDescription]
        if (lstMove[0] >= 1 && lstMove[0] <= 4){
            this._moves[lstMove[0] - 1] = lstMove[1];
            // set move tooltip
            this.updateMoveTT(lstMove[3]);
        }
        else{
            console.log("invalid move #");
        }
    }

    get moves(){
        return this._moves;
    }

    //properties/functions
    updateStats(natureName : string) : number[]{
        // set nature multiplier using base stats and nature name (Member.updateStats(natureName))
        // response.stats[0] - [5] and lstStatElements[0] - [5] = hp, atk, def, spatk, spdef, spd

        // reset stast div with default base stats, then apply nature multiplier
        // this._stats[0] * .10
        let slotNum = this._slotNum;

        let statsAfterCalc : number[] = [];
        return statsAfterCalc;
    }

    private updateAbilityTT(abilityDescription : string = ""){
        let slotNum = this._slotNum;
        let elAbilityTooltip = document.getElementById(`slot-${slotNum}-ability-tooltip`);
        let elAbilityTooltipText = <HTMLElement>elAbilityTooltip!.querySelector(".ability-tooltip-text");
        elAbilityTooltipText.innerText = abilityDescription;
        elAbilityTooltipText.style.display = "flex";
        let tooltipMarginLeft = (-elAbilityTooltipText!.offsetWidth + elAbilityTooltip!.offsetWidth) / 2;
        elAbilityTooltipText.style.display = "none";
        elAbilityTooltipText.style.cssText = `margin-left: ${tooltipMarginLeft}px;`;
    }

    private updateMoveTT(moveDescription : string){
        let slotNum = this._slotNum;
    }

    private updateNatureTT(natureName : string){
        let slotNum = this._slotNum;
    }

}