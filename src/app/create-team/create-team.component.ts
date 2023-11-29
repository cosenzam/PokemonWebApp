import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { Pokemon } from '../interface/pokemon';
import { setTypes, setFrontSprite, setStats, selectAbilities } from '../modules/info-module';
import { pokeNatures } from '../globals/global-constants';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent {

  constructor(private pokeAPIService: PokeAPIService) {}

  pokeName1 = new FormControl('');
  pokeName2 = new FormControl('');
  pokeName3 = new FormControl('');
  pokeName4 = new FormControl('');
  pokeName5 = new FormControl('');
  pokeName6 = new FormControl('');
  pokeNames: string[] = [];
  apiResponses: Pokemon[] = [];
  
  onClick(slotNum: number): void{
    console.log(`teams element ${slotNum} clicked`);
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-box`)).style.cssText = "display:none;";
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-input`)).style.cssText = "display:flex;";
  }

  onSubmit(slotNum: number, pokeName: FormControl): void{
    // store all moves in a list for autocomplete
    // when clicking on moves form, show all moves if nothing is typed in, autocomplete for each letter typed
    console.log(`slot ${slotNum} input: ${pokeName.value}`)
    if (pokeName.value != ""){
      this.pokeAPIService.getPokemon(pokeName.value!.toLowerCase()).subscribe((response)=>{
        // update slot info if response recieved, display error if pokemon does not exist
        // dropdown to choose ability
        // autocomplete to choose moves
        let pokeName = response.name;
        let pokeTypes: string[] = [];
        let pokeAbilities: string[] = [];
        response.types.forEach((item, index) => pokeTypes.push(response.types[index].type.name));
        response.abilities.forEach((item, index) => pokeAbilities.push(response.abilities[index].ability.name));
        pokeAbilities.forEach((item, index) => pokeAbilities[index] = pokeAbilities[index].charAt(0).toUpperCase() + pokeAbilities[index].slice(1));

        (<HTMLElement>document.querySelector(`.slot-${slotNum}`)).querySelector(".invalid-pokemon")!.innerHTML = "";
        (<HTMLElement>document.querySelector(`.slot-${slotNum}-info`)).style.cssText = "display:flex;";
        setFrontSprite(response, `slot-${slotNum}-sprite`);
        setTypes(pokeTypes);
        document.getElementById("poke-Name")!.innerHTML = "Pokémon: " + pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
        document.getElementById("poke-Abilities")!.innerHTML = "Ability: ";
        setStats(response, "teams", slotNum);

        selectAbilities(pokeAbilities, slotNum);

        // store subscribe response for ?
        this.apiResponses[slotNum - 1] = response; console.log(this.apiResponses[slotNum - 1]);
      }, 
      (error: any) => {
        (<HTMLElement>document.querySelector(`.slot-${slotNum}-info`)).style.cssText = "display:none;";
        (<HTMLElement>document.querySelector(`.slot-${slotNum}`)).querySelector(".invalid-pokemon")!.innerHTML = "Pokémon does not exist!";
        console.log("Pokémon not found")
      });
    }
    //console.log(this.apiResponses[0].moves[0].move.name);

  }

}
