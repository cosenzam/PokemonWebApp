import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { Pokemon } from '../interface/pokemon';
import { setTypes, setFrontSprite, setStats, toHyphenFormat, correctPokemonForms, setAbilityTooltipTeams, setAbilitiesTeams } from '../modules/info-module';
import { pokeNatures } from '../globals/global-constants';
import { forkJoin} from 'rxjs';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent {

  constructor(private pokeAPIService: PokeAPIService) {}

  pokeName1 = new FormControl("Pikachu");
  pokeName2 = new FormControl('');
  pokeName3 = new FormControl('');
  pokeName4 = new FormControl('');
  pokeName5 = new FormControl('');
  pokeName6 = new FormControl('');
  pokeNames: string[] = [];
  apiResponses: Pokemon[] = [];
  abilityDescriptions = new Map(); // list of ability descriptions for each mon
  nationalPokedex = new Map();
  isLoading = false; // flag for preventing/allowing the start of the next API request OR execution of functions in parallel
  lastSearch : string | null = ""; // avoid submitting same input more than once
  
  onClickAddMember(slotNum : number): void{
    console.log(`teams element ${slotNum} clicked`);
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-box`)).style.cssText = "display:none;";
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-input`)).style.cssText = "display:flex;";
  }

  onClickRemoveMember(slotNum : number) : void{
    let elSlotDiv = document.getElementById("slot-"+`${slotNum}`);
    console.log(`member ${slotNum} removed`);
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-info`)).style.cssText = "display:none;";
    (<HTMLElement>elSlotDiv!.querySelector(".remove-btn-wrapper"))!.style.cssText = "display:none;";
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-input`)).style.cssText = "display:flex;";
  }

  // when option on dropdown is clicked, show ability description when hovering ? symbol
  onChangeAbilities(slotNum : number, abilityName : string) : void{
    console.log(slotNum, abilityName);
    let abilityDescription = this.abilityDescriptions.get(abilityName);
    setAbilityTooltipTeams(abilityName, abilityDescription, slotNum);
  }

  onSubmit(slotNum : number, formPokeName : FormControl): void{
    if (this.isLoading == false){
      if (formPokeName.value != "" && this.lastSearch != formPokeName.value){
        //console.log(this.textControl.value);
        let pokeName = toHyphenFormat(formPokeName.value!.toLowerCase());
        //console.log(pokeName);
        this.lastSearch = pokeName;
        let obsPokeInfo : any;
        var elSlotDiv = document.getElementById("slot-"+`${slotNum}`);

        // correct names for pokemon with different forms
        const lstPokeNames = correctPokemonForms(pokeName);
        pokeName = lstPokeNames![2];
        obsPokeInfo = this.pokeAPIService.getPokemon(lstPokeNames![0]);

        let obsAbilityDescriptions : any[] = []; // list of observables
        const obsForkJoin1 = forkJoin(obsPokeInfo);
        
        // forkJoin() then subscribe to re-sync async API requests and keep the order they were called in
        // response[0] = pokeAPIService.getPokemon(), response[1] = pokeAPIService.getPokedexEntry()
        obsForkJoin1.subscribe((response : any) => {
          this.isLoading = true;
          (<HTMLElement>document.querySelector(".slot-"+`${slotNum}`+"-input"))!.style.cssText = "display:none;";
          (<HTMLElement>elSlotDiv!.querySelector(".slot-"+`${slotNum}`+"-info"))!.style.cssText = "display:none;";
          (<HTMLElement>elSlotDiv!.querySelector(".remove-btn-wrapper"))!.style.cssText = "display:inline-block;";
          elSlotDiv!.querySelector(".invalid-pokemon")!.innerHTML = "";
          // Pokemon Name
          elSlotDiv!.querySelector("#poke-name")!.innerHTML = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
          // Pokemon Sprites
          setFrontSprite(response[0], <HTMLElement>elSlotDiv!.querySelector("#front-sprite"));
          // Pokemon Types
          let pokeTypes : string[] = [];
          response[0].types.forEach((item : any, index : number) => pokeTypes.push(response[0].types[index].type.name));
          setTypes(pokeTypes, <HTMLElement>elSlotDiv!.querySelector(".teams-type-wrapper"));
          // Pokemon Abilities
          let elPokeAbilities = elSlotDiv!.querySelector("#poke-abilities");
      
          // Pokemon Stats (most recent generation)
          //setStats(response[0], "search", slotNum);

          // Pokemon Abilties | wait for abilities response, then make poke-info div visible to avoid pop-in
          for (let [index, ability] of response[0].abilities.entries()){
            obsAbilityDescriptions.push(this.pokeAPIService.getAbilityInfo(ability.ability.url));
          }
          // Nested forkJoin()
          let obsForkJoin2 = forkJoin(obsAbilityDescriptions);
          obsForkJoin2.subscribe((response : any[]) => {
            (<HTMLElement>elSlotDiv!.querySelector(".slot-"+`${slotNum}`+"-info"))!.style.cssText = "display:flex;";
            for (let [index, ability] of response.entries()){
              try{
                setAbilitiesTeams(ability.name, ability.effect_entries[1].short_effect, slotNum);
                this.abilityDescriptions.set(ability.name, ability.effect_entries[1].short_effect);
              }
              catch{
                console.log("no ability description found");
                setAbilitiesTeams(ability.name, "", slotNum);
              }
            }
            this.isLoading = false;
          },
          (error: any) =>{
            (<HTMLElement>elSlotDiv!.querySelector(".slot-"+`${slotNum}`+"-info"))!.style.cssText = "display:flex;";
            console.log("nested subscribe ability desc error");
            this.isLoading = false;
          });
          
        },
        (error: any) =>{
          (<HTMLElement>elSlotDiv!.querySelector(".slot-"+`${slotNum}`+"-info"))!.style.cssText = "display:none;";
          document.getElementById("slot"+`${slotNum}`)!.querySelector(".invalid-pokemon")!.innerHTML = "Pokémon does not exist!";
          console.log("Pokémon not found")
          this.isLoading = false;
        });
      }
    }

  }

}
