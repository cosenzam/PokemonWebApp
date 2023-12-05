import { Component, OnInit, Input} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { setSprites, setTypes, setStats, setAbilityTooltip, setPokedexEntry } from '../modules/info-module';

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

    if (this.textControl.value != ""){
      this.pokeAPIService.getPokemon(this.textControl.value!.toLowerCase()).subscribe((response)=>{

        //let pokeStats: number[] = [];
        //response.stats.forEach((item, index) => pokeStats.push(response.stats[index].base_stat));

        // remove text if previous input was invalid
        (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "";

        document.getElementById("poke-info-search")!.style.cssText = "display:flex;";

        // Pokemon Name
        let pokeName = response.name;
        document.getElementById("poke-Name")!.innerHTML = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

        // Pokemon Sprites
        setSprites(response); // set image src to front and back sprites

        // Pokemon Types
        let pokeTypes : string[] = [];
        response.types.forEach((item, index) => pokeTypes.push(response.types[index].type.name));
        setTypes(pokeTypes); // set type background color

        // Pokemon Abilities
        let pokeAbilities : string[] = [];
        response.abilities.forEach((item, index) => pokeAbilities.push(response.abilities[index].ability.name));
        let elPokeAbilities = document.getElementById("poke-Abilities");
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
          //console.log(lastEntryIndex);
          setPokedexEntry(response.flavor_text_entries[lastEntryIndex].flavor_text); // cant pop() i think?
        },
        (error: any) =>{
          console.log("invalid pokemon name (pokedex)");
          (<HTMLElement>document.getElementById("poke-pokedex-text")).innerHTML = "";
        },
        ()=>{
          //console.log("entry subscribe complete");
        });

        document.getElementById("poke-Height")!.innerHTML = (response.height * 0.1).toFixed(1) + " m";
        document.getElementById("poke-Weight")!.innerHTML = (response.weight * 0.1).toFixed(1) + " kg";
        
        setStats(response, "search");

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
  }

}
