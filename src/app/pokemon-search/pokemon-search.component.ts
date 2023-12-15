import { Component, OnInit, Input} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { setSprites, setTypes, setStats, setAbilityTooltip, setPokedexEntry } from '../modules/info-module';
import { forkJoin, pipe, Observable } from 'rxjs';

@Component({
  selector: 'app-pokemon-search',
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.css']
})
export class PokemonSearchComponent implements OnInit{
  
  textControl = new FormControl("Pikachu", [Validators.required, Validators.minLength(3)]);
  //message : any = ''; // this is the sending/parent line
  //@Input() message !: string; // this is the receiving/child line
  nationalPokedex = new Map();
  responsePokemon : any;
  responseAbilities : any[] = [];
  responsePokedex : any;

  // PokeAPIService constuctor
  constructor(private pokeAPIService : PokeAPIService) {}

  ngOnInit(){
    // submits form OnInit if form is already filled (used on redirect from Pokedex component to Search component)
    /*
    if (this.textControl.value != ""){
      this.onSubmit();
    }
    */
    /*
    this.pokeAPIService.getPokedexNational().subscribe((response)=>{
      response.pokemon_entries.forEach((item: any, index: any) => this.nationalPokedex.set(item.pokemon_species.name, item.entry_number));
    },
    (error: any) =>{
      console.log("Failed to retrieve national pokedex")
    },
    () =>{
      console.log("national pokedex retrieved");
      console.log(this.nationalPokedex.get("bulbasaur"));
      console.log(this.nationalPokedex.get("snivy"));
    });
    */
  }
  
  
  onSubmit(): void {

    // store getPokemon() and getPokedexEntry() as observable variables
    // let obsPokeInfo = this.pokeAPIService.getPokemon(pokeName), let obsPokedexEntry = this.pokeAPIService.getPokedexEntry(pokeName)
    // Observable.forkJoin([obsPokeInfo, obsPokedexEntry])
    // this means that code within the forkJoin will only be executed after both requests are completed
    // forkJoin returns as a list of observables

    // request ability descriptions after first getPokemon() forkJoin
    // forkJoin albilities to ensure they stay in order of requested
    // let obsAbilityDescriptions[0] = this.pokeAPIService.getPokemon(lstPokeAbilities[0]), let obsPokeAbilities[1] = this.pokeAPIService.getPokemon(lstPokeAbilities[1])
    // Observable.forkJoin([obsAbilityDescriptions[0], obsAbilityDescriptions[1]...])
    // display poke-info div when pokeAbilities forkJoin is complete, this way everything will be loaded before the div is shown to the user and nothing will pop in at random timings


    if (this.textControl.value != ""){
      let pokeName = this.textControl.value!.toLowerCase();
      let obsPokeInfo : any;
      let obsPokedexEntry : any;

      // correct names for pokemon forms
      // pokemon to account for: giratina, shaymin, basculin, landrous and friends...
      if (pokeName == "giratina" || pokeName == "giratina-altered"){
        obsPokeInfo = this.pokeAPIService.getPokemon("giratina-altered");
        obsPokedexEntry = this.pokeAPIService.getPokedexEntry("giratina");
      }
      else{
        obsPokeInfo = this.pokeAPIService.getPokemon(pokeName);
        obsPokedexEntry = this.pokeAPIService.getPokedexEntry(pokeName);
      }

      let obsAbilityDescriptions : any[] = []; // list of observables
      const obsForkJoin1 = forkJoin([obsPokeInfo, obsPokedexEntry]);
      
      // forkJoin() then subscribe to re-sync async API requests and keep the order they were called in
      // response[0] = pokeAPIService.getPokemon(), response[1] = pokeAPIService.getPokedexEntry()
      obsForkJoin1.subscribe((response : any[]) => {
        // avoid async ability pop in while ability request is being received
        document.getElementById("poke-info-search")!.style.cssText = "display:none;";

        // remove text if previous input was invalid
        (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "";

        // Pokemon Name
        document.getElementById("poke-name")!.innerHTML = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

        // Pokemon Sprites
        setSprites(response[0]); // set image src to front and back sprites

        // Pokemon Types
        let pokeTypes : string[] = [];
        response[0].types.forEach((item : any, index : number) => pokeTypes.push(response[0].types[index].type.name));
        setTypes(pokeTypes); // set type background color

        // Pokemon Abilities
        let elPokeAbilities = document.getElementById("poke-abilities");
        elPokeAbilities!.innerHTML = "" // remove previous children in case there was a previous search

        // Pokedex Entry Description
        let lastEntryIndex = response[1].flavor_text_entries.length - 1; // last entry with language.name == "en" is newest one
          while (response[1].flavor_text_entries[lastEntryIndex].language.name != "en"){
            lastEntryIndex -= 1;
          }
        setPokedexEntry(response[1].flavor_text_entries[lastEntryIndex].flavor_text);

        // Pokemon Height and Weight in m and kg
        document.getElementById("poke-height")!.innerHTML = (response[0].height * 0.1).toFixed(1) + " m";
        document.getElementById("poke-weight")!.innerHTML = (response[0].weight * 0.1).toFixed(1) + " kg";
        
        // Pokemon Stats (most recent generation)
        setStats(response[0], "search");

        this.responsePokemon = response;

        // Pokemon Abilties | wait for abilities response, then make poke-info div visible
        for (let [index, ability] of response[0].abilities.entries()){
          obsAbilityDescriptions.push(this.pokeAPIService.getAbilityInfo(ability.ability.url));
        }
        // Nested forkJoin()
        let obsForkJoin2 = forkJoin(obsAbilityDescriptions);
        obsForkJoin2.subscribe((response : any[]) => {
          document.getElementById("poke-info-search")!.style.cssText = "display:flex;";
          for (let [index, ability] of response.entries()){
            setAbilityTooltip(ability.name, ability.effect_entries[1].short_effect);
          }
        },
        (error: any) =>{
          document.getElementById("poke-info-search")!.style.cssText = "display:flex;";
          console.log("nested subscribe ability desc error");
        });
        
      },
      (error: any) =>{
        if (error.url.includes("species")){ // is a pokedex description error
          document.getElementById("poke-info-search")!.style.cssText = "display:none;";
          console.log("Pokédex description not found")
        }
        else{
        document.getElementById("poke-info-search")!.style.cssText = "display:none;";
        (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "Pokémon does not exist!";
        console.log("Pokémon not found")
        }
      });
    }

    /*
    if (this.textControl.value != ""){
      this.pokeAPIService.getPokemon(this.textControl.value!.toLowerCase()).subscribe((response)=>{

        //let pokeStats: number[] = [];
        //response.stats.forEach((item, index) => pokeStats.push(response.stats[index].base_stat));

        // remove text if previous input was invalid
        (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "";

        document.getElementById("poke-info-search")!.style.cssText = "display:flex;";

        // Pokemon Name
        let pokeName = response.name;
        document.getElementById("poke-name")!.innerHTML = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

        // Pokemon Sprites
        setSprites(response); // set image src to front and back sprites

        // Pokemon Types
        let pokeTypes : string[] = [];
        response.types.forEach((item, index) => pokeTypes.push(response.types[index].type.name));
        setTypes(pokeTypes); // set type background color

        // Pokemon Abilities
        let pokeAbilities : string[] = [];
        response.abilities.forEach((item, index) => pokeAbilities.push(response.abilities[index].ability.name));
        let elPokeAbilities = document.getElementById("poke-abilities");
        elPokeAbilities!.innerHTML = "" // remove previous children in case there was a previous search

        // Ability Tooltips
        // loop of nested subscribes, executed async to outer subscribe, bad! ** Observables can be returned in different orders
        // learn switchMap, mergeMap, pipe
        for (let [index, ability] of response.abilities.entries()){
          let length = response.abilities.length;
          let isLastIndex = false;
          if (index == length - 1){ isLastIndex = true; } // do not concat a comma to tooltip <span> if is last ability in list
          this.pokeAPIService.getAbilityInfo(ability.ability.url).subscribe((response)=>{
            if (response.effect_entries.length > 0){
              setAbilityTooltip(ability.ability.name, response.effect_entries[1].short_effect, isLastIndex);
            }
            else{
              setAbilityTooltip(ability.ability.name, "", isLastIndex);
              console.log("no ability description found");
            }
          }, 
          (error: any) => {
            console.log("nested subscribe ability desc error");
          },
          () =>{
            //console.log("nested subscribe complete");
          });
        }

        // Pokedex Entry Description
        this.pokeAPIService.getPokedexEntry(pokeName).subscribe((response)=>{
          let lastEntryIndex = response.flavor_text_entries.length - 1; // last entry with language.name == "en" is newest one
          while (response.flavor_text_entries[lastEntryIndex].language.name != "en"){
            lastEntryIndex -= 1;
          }
          setPokedexEntry(response.flavor_text_entries[lastEntryIndex].flavor_text);
        },
        (error: any) =>{
          console.log("invalid pokemon name (pokedex)");
          (<HTMLElement>document.getElementById("poke-pokedex-text")).innerHTML = "";
        },
        ()=>{
          //console.log("entry subscribe complete");
        });

        document.getElementById("poke-height")!.innerHTML = (response.height * 0.1).toFixed(1) + " m";
        document.getElementById("poke-weight")!.innerHTML = (response.weight * 0.1).toFixed(1) + " kg";
        
        setStats(response, "search");

        this.responsePokemon = response;

      },
      (error: any) =>{
        document.getElementById("poke-info-search")!.style.cssText = "display:none;";
        (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "Pokémon does not exist!";
        console.log("Pokémon not found")
      },
      () =>{
        //console.log("outer subscribe complete");
      });
      // any code here will be **likely** executed before subscribe response | do not use
    }
    */

  }
  

}
