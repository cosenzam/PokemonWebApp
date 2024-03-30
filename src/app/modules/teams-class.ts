// import general functions from info-module
import { capitalizeFirst } from "./info-module";


// create class 
// class object for each team slot
// will help to keep state for things like currently selected move in slots, current tooltip move and desc
// init/constructor will call all teams functions, constructor params will be api request(s)
// keep base stat values to calculate natures

export class Member{
    _pokeName : string;
    _apiResponse : any;
    _stats : string[];

    //constructor
    constructor(pokeName = "", apiResponse : any){
        this._pokeName = pokeName;
        this._apiResponse = apiResponse;
        this._stats = []; // stats = apiResponse.stats whatever stuff
    }

    set stats(nature : string){
        // set nature multiplier using base stats and nature name (Member.stats(natureName))
    }

    get stats() : string[]{
        return this._stats;
    }

    //properties/functions
}