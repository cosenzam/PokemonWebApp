import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { setSprites, setTypes, setStats, setAbilityTooltip } from '../modules/info-module';

@Component({
  selector: 'app-pokemon-search',
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.css']
})
export class PokemonSearchComponent {
  
  // Reactive form for getting pokemon name
  textControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  //message : any = '';

  // constructor for using PokeAPIService and its methods
  constructor(private pokeAPIService: PokeAPIService) {}

  onSubmit(): void {

    // subscribe to receive response from PokeAPI 
    if (this.textControl.value != ""){
      this.pokeAPIService.getPokemon(this.textControl.value!.toLowerCase()).subscribe((response)=>{

        // add pkmn types and abilities to array for organization
        let pokeName = response.name;
        let pokeTypes: string[] = [];
        let pokeAbilities: string[] = [];
        //let pokeStats: number[] = [];
        response.types.forEach((item, index) => pokeTypes.push(response.types[index].type.name));
        response.abilities.forEach((item, index) => pokeAbilities.push(response.abilities[index].ability.name));
        //response.stats.forEach((item, index) => pokeStats.push(response.stats[index].base_stat));
        pokeAbilities.forEach((item, index) => pokeAbilities[index] = pokeAbilities[index].charAt(0).toUpperCase() + pokeAbilities[index].slice(1));

        // update HTML
        (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "";
        document.getElementById("poke-Info")!.style.cssText = "display:flex; flex-direction:column;";
        setSprites(response); // set image src to front and back sprites
        setTypes(pokeTypes); // set type background color
        
        document.getElementById("poke-Name")!.innerHTML = "Pokémon: " + pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
        //document.getElementById("poke-Abilities")!.innerHTML = "Abilities: " + pokeAbilities.join(", ");

        document.getElementById("poke-Height")!.innerHTML = "Height: " + (response.height * 0.1).toFixed(1) + " m";
        document.getElementById("poke-Weight")!.innerHTML = "Weight: " + (response.weight * 0.1).toFixed(1) + " kg";
        
        setStats(response, "search");

        // remove previous abilities because things are appended to this element rather than changed
        let elPokeAbilities = document.getElementById("poke-Abilities");
        elPokeAbilities!.innerHTML = "Abilities: ";

        // loop of nested subscribes, executed async to outer subscribe, bad!
        // learn switchMap, mergeMap, pipe
        for (let [index, ability] of response.abilities.entries()){
          let length = response.abilities.length;
          let isLastIndex = false;
          if (index == length - 1){ isLastIndex = true; } // do not concat a comma to tooltip <span> if is last ability in list
          // add description tooltips to abilties
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

      },
        (error: any) => {
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
