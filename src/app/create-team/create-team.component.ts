import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { Pokemon } from '../interface/pokemon';
import { setTypes, setFrontSprite, setStats, toHyphenFormat, correctPokemonForms, setAbilitiesTeams, setNatures, setAbilityTooltipTeams, setNatureTooltipTeams, setMoves, setMoveTooltip} from '../modules/info-module';
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
  moveDescription = new Map();
  nationalPokedex = new Map();
  isLoading = false; // flag for preventing/allowing the start of the next API request OR execution of functions in parallel
  lastSearch : string | null = ""; // avoid submitting same input more than once
  
  ngOnInit(){
    // set natures for each slot
    //setNatures(elSlotDiv, slotNum);
    //setNatureTooltipTeams("hardy", slotNum);
  }

  onClickAddMember(slotNum : number): void{
    //console.log(`teams element ${slotNum} clicked`);
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

  onChangeAbilities(slotNum : number, abilityName : string) : void{
    let abilityDescription = this.abilityDescriptions.get(abilityName);
    //console.log(abilityName, abilityDescription);
    setAbilityTooltipTeams(abilityDescription, slotNum);
  }

  onChangeNature(slotNum : number, natureName : string){
    setNatureTooltipTeams(natureName, slotNum);
  }

  onChangeMoves(slotNum : number, moveNum : number, moveName : string){
    let elSelectMove = <HTMLInputElement>document.getElementById(`slot-${slotNum}-move-${moveNum}`);
    if (!(this.moveDescription.get(moveName) || elSelectMove.value == "default")){
      this.moveDescription.set(moveName, ""); // avoid potential duplicate key by not waiting on api response before creating key
      let obsMoveInfo = this.pokeAPIService.getMoveInfo(moveName);
      obsMoveInfo.subscribe((response : any) => {
        //console.log(response.effect_entries[0].effect);
        this.moveDescription.set(moveName, response);
        setMoveTooltip(response, moveNum, slotNum);
      },
      (error: any) =>{
        console.log("move desc error");
      });
    }
    else{
      //console.log(this.moveDescription.get(moveName));
      setMoveTooltip(this.moveDescription.get(moveName), slotNum, moveNum);
    }

    // **** selecting one move then immediately choosing another could result in incorrect tooltips bc async requests | edge case
    // maybe create a class to keep state of each slot
  }

  onSubmit(slotNum : number, formPokeName : FormControl): void{
    if (this.isLoading == false){
      if (formPokeName.value != "" && this.lastSearch != formPokeName.value){
        //console.log(this.textControl.value);
        let pokeName = toHyphenFormat(formPokeName.value!.toLowerCase());
        //console.log(pokeName);
        this.lastSearch = pokeName;
        var elSlotDiv = document.getElementById("slot-"+`${slotNum}`);
        (<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:flex;";

        // correct names for pokemon with different forms
        const lstPokeNames = correctPokemonForms(pokeName);
        pokeName = lstPokeNames![2];

        let obsPokeInfo = this.pokeAPIService.getPokemon(lstPokeNames![0]);
        obsPokeInfo.subscribe((response : any) => {
          this.isLoading = true;
          setNatures(elSlotDiv, slotNum);
          setNatureTooltipTeams("hardy", slotNum);
          (<HTMLElement>document.querySelector(`.slot-${slotNum}-input`))!.style.cssText = "display:none;";
          //(<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:none;";
          (<HTMLElement>elSlotDiv!.querySelector(".remove-btn-wrapper"))!.style.cssText = "display:inline-block;";
          elSlotDiv!.querySelector(".invalid-pokemon")!.innerHTML = "";

          elSlotDiv!.querySelector("#poke-name")!.innerHTML = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

          setFrontSprite(response, <HTMLElement>elSlotDiv!.querySelector(`#slot-${slotNum}-sprite`));

          let pokeTypes : string[] = [];
          response.types.forEach((item : any, index : number) => pokeTypes.push(response.types[index].type.name));
          setTypes(pokeTypes, <HTMLElement>elSlotDiv!.querySelector(".teams-type-wrapper"));

          document.getElementById("slot-1-abilities")!.innerHTML = "";
          let elPokeAbilities = elSlotDiv!.querySelector("#poke-abilities");

          setMoves(response, <HTMLElement>elSlotDiv!.querySelector("#poke-moves"), slotNum);

          setStats(response, "teams", slotNum);

          let obsAbilityDescriptions : any[] = [];
          for (let [index, ability] of response.abilities.entries()){
            obsAbilityDescriptions.push(this.pokeAPIService.getAbilityInfo(ability.ability.url));
          }
          let obsForkJoin2 = forkJoin(obsAbilityDescriptions);
          obsForkJoin2.subscribe((response : any[]) => {
            //(<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:flex;";
            setAbilityTooltipTeams(response[0].effect_entries[1].short_effect, slotNum);
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
            //(<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:flex;";
            console.log("nested subscribe ability desc error");
            this.isLoading = false;
          });
          
        },
        (error: any) =>{
          //(<HTMLElement>elSlotDiv!.querySelector(`.slot-${slotNum}-info`))!.style.cssText = "display:none;";
          document.getElementById("slot"+`${slotNum}`)!.querySelector(".invalid-pokemon")!.innerHTML = "Pokémon does not exist!";
          console.log("Pokémon not found")
          this.isLoading = false;
        });
      }
    }

  }

}
