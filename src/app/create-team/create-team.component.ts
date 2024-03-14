import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { Pokemon } from '../interface/pokemon';
import { setTypes, setFrontSprite, setStats, toHyphenFormat, correctPokemonForms, setAbilitiesTeams, setNatures, setTeamsTooltip, setMoves } from '../modules/info-module';
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
    let elSlotDiv = document.getElementById(`slot-${slotNum}`);
    console.log(`member ${slotNum} removed`);
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-info`)).style.cssText = "display:none;";
    (<HTMLElement>elSlotDiv!.querySelector(".remove-btn-wrapper"))!.style.cssText = "display:none;";
    (<HTMLElement>document.querySelector(`.slot-${slotNum}-input`)).style.cssText = "display:flex;";
  }

  onChangeShinyToggle(slotNum : number){
    let elCheckbox = <HTMLInputElement>document.getElementById(`slot-${slotNum}-shiny`);
    let elSpriteDefault = <HTMLElement>document.querySelector(`#slot-${slotNum}-sprite`)!.querySelector("#sprite-default");
    let elSpriteShiny = <HTMLElement>document.querySelector(`#slot-${slotNum}-sprite`)!.querySelector("#sprite-shiny");
    if (elCheckbox!.checked){
      elSpriteDefault!.style.cssText = "display:none;justify-content:space-between;";
      elSpriteShiny!.style.cssText = "display:flex;justify-content:space-between;";
    }
    else {
      elSpriteDefault!.style.cssText = "display:flex;justify-content:space-between;";
      elSpriteShiny!.style.cssText = "display:none;justify-content:space-between;";
    }
  }

  // when option on dropdown is clicked, show ability description when hovering ? symbol
  onChangeAbilities(slotNum : number, abilityName : string) : void{
    let abilityDescription = this.abilityDescriptions.get(abilityName);
    //console.log(abilityName, abilityDescription);
    setTeamsTooltip("ability", slotNum, abilityDescription, "");
  }

  onChangeNature(slotNum : number, natureName : string){
    setTeamsTooltip("nature", slotNum, "", natureName);
  }

  onChangeMoves(slotNum : number, moveNum : number, moveName : string){

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

        // Natures
        setNatures(elSlotDiv, slotNum); // * can create a flag to not set these static values every time
        setTeamsTooltip("nature", slotNum, "", "hardy");
        
        obsForkJoin1.subscribe((response : any) => {
          this.isLoading = true;
          (<HTMLElement>document.querySelector(`.slot-${slotNum}-input`))!.style.cssText = "display:none;";
          (<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:none;";
          (<HTMLElement>elSlotDiv!.querySelector(".remove-btn-wrapper"))!.style.cssText = "display:inline-block;";
          elSlotDiv!.querySelector(".invalid-pokemon")!.innerHTML = "";
          // Pokemon Name
          elSlotDiv!.querySelector("#poke-name")!.innerHTML = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
          // Pokemon Sprites
          setFrontSprite(response[0], <HTMLElement>elSlotDiv!.querySelector(`#slot-${slotNum}-sprite`), slotNum);
          // Pokemon Types
          let pokeTypes : string[] = [];
          response[0].types.forEach((item : any, index : number) => pokeTypes.push(response[0].types[index].type.name));
          setTypes(pokeTypes, <HTMLElement>elSlotDiv!.querySelector(".teams-type-wrapper"));
          // Pokemon Abilities
          document.getElementById("slot-1-abilities")!.innerHTML = "";
          let elPokeAbilities = elSlotDiv!.querySelector("#poke-abilities");

          // Pokemon Moves
          setMoves(response, elSlotDiv!);

          // Pokemon Abilties | wait for abilities response, then make poke-info div visible to avoid pop-in
          for (let [index, ability] of response[0].abilities.entries()){
            obsAbilityDescriptions.push(this.pokeAPIService.getAbilityInfo(ability.ability.url));
          }
          // Nested forkJoin()
          let obsForkJoin2 = forkJoin(obsAbilityDescriptions);
          obsForkJoin2.subscribe((response : any[]) => {
            (<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:flex;";
            setTeamsTooltip("ability", slotNum, response[0].effect_entries[1].short_effect, "");
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
            (<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:flex;";
            console.log("nested subscribe ability desc error");
            this.isLoading = false;
          });

          // Pokemon Stats (most recent generation)
          //setStats(response[0], "search", slotNum);
          
        },
        (error: any) =>{
          (<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:none;";
          document.getElementById("slot"+`${slotNum}`)!.querySelector(".invalid-pokemon")!.innerHTML = "Pokémon does not exist!";
          console.log("Pokémon not found")
          this.isLoading = false;
        });
      }
    }

  }

}
