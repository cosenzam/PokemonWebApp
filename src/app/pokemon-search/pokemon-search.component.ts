import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { displaySprites, displayTypes, displayStats } from '../modules/info-module';

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
          displaySprites(response); // set image src to front and back sprites
          displayTypes(pokeTypes); // set type background color
          
          document.getElementById("poke-Name")!.innerHTML = "Pokémon: " + pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
          // DO NOT change innerHTML here hence losing child divs
          document.getElementById("poke-Abilities")!.innerHTML = "Abilities: " + pokeAbilities.join(", ");
          // append ability description tooltip to abilities div
          //  <div class="poke-Abilities">Abilities: 
          //    <span class="tooltip">pokeAbilities[0]
          //      <span class="ability-tooltip-text">abilityDescription[0]</span>
          //    </span>
          //  </div>
          document.getElementById("poke-Height")!.innerHTML = "Height: " + (response.height * 0.1).toFixed(1) + " m";
          document.getElementById("poke-Weight")!.innerHTML = "Weight: " + (response.weight * 0.1).toFixed(1) + " kg";
          
          displayStats(response, "search");

          // loop of nested subscribes, executed async to outer subscribe, bad!
          // learn switchMap, mergeMap, pipe
          for (let ability of response.abilities){
            this.pokeAPIService.getAbilityInfo(ability.ability.url).subscribe((response)=>{
              console.log(response.effect_entries[1].short_effect);
            }, 
              (error: any) => {
                console.log("nested subscribe ability desc error");
              },
              () =>{
                console.log("nested subscribe complete");
              });
          }

      },
        (error: any) => {
          document.getElementById("poke-Info")!.style.cssText = "display:none;";
          (<HTMLElement>document.querySelector(".invalid-pokemon"))!.innerHTML = "Pokémon does not exist!";
          console.log("Pokémon not found")
        },
        () =>{
          console.log("outer subscribe complete");
        });
      // any code here will be **likely** executed before subscribe response | do not use
    }
  }

}
