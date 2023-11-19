import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { setSprites, setTypes, setStats, setAbilityTooltip, setPokedexEntry } from '../modules/info-module';

@Component({
  selector: 'app-pokemon-search',
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.css']
})
export class PokemonSearchComponent {
  
  textControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  //message : any = '';

  // PokeAPIService constuctor
  constructor(private pokeAPIService: PokeAPIService) {}

  onSubmit(): void {

    if (this.textControl.value != ""){
      this.pokeAPIService.getPokemon(this.textControl.value!.toLowerCase()).subscribe((response)=>{

        //let pokeStats: number[] = [];
        //response.stats.forEach((item, index) => pokeStats.push(response.stats[index].base_stat));

        // remove text if previous input was invalid
        (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "";

        document.getElementById("poke-Info")!.style.cssText = "display:flex; flex-direction:column;";

        // Pokemon Name
        let pokeName = response.name;
        document.getElementById("poke-Name")!.innerHTML = "Pokémon: " + pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

        // Pokemon Sprites
        setSprites(response); // set image src to front and back sprites

        // Pokemon Types
        let pokeTypes: string[] = [];
        response.types.forEach((item, index) => pokeTypes.push(response.types[index].type.name));
        setTypes(pokeTypes); // set type background color

        // Pokemon Abilities
        let pokeAbilities: string[] = [];
        response.abilities.forEach((item, index) => pokeAbilities.push(response.abilities[index].ability.name));
        let elPokeAbilities = document.getElementById("poke-Abilities");
        elPokeAbilities!.innerHTML = "Abilities: "; // remove previous children in case there was a previous search

        // loop of nested subscribes, executed async to outer subscribe, bad! ** Observables can be returned in different orders
        // learn switchMap, mergeMap, pipe
        // Ability Tooltips
        for (let [index, ability] of response.abilities.entries()){
          let length = response.abilities.length;
          let isLastIndex = false;
          if (index == length - 1){ isLastIndex = true; } // do not concat a comma to tooltip <span> if is last ability in list
          this.pokeAPIService.getAbilityInfo(ability.ability.url).subscribe((response)=>{
            setAbilityTooltip(ability.ability.name, response.effect_entries[1].short_effect, isLastIndex);
          }, 
          (error: any) => {
            console.log("nested subscribe ability desc error");
          },
          () =>{
            //console.log("nested subscribe complete");
          });
        }

        // Pokedex Entry Description | pokedex # probably too inconsistent?
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
        },
        ()=>{
          //console.log("entry subscribe complete");
        });

        document.getElementById("poke-Height")!.innerHTML = "Height: " + (response.height * 0.1).toFixed(1) + " m";
        document.getElementById("poke-Weight")!.innerHTML = "Weight: " + (response.weight * 0.1).toFixed(1) + " kg";
        
        setStats(response, "search");

      },
      (error: any) =>{
        document.getElementById("poke-Info")!.style.cssText = "display:none;";
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
