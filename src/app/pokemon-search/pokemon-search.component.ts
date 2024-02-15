import { Component, OnInit, Input} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PokeAPIService } from '../service/poke-api.service';
import { setSprites, setTypes, setStats, setAbilityTooltip, setPokedexEntry, correctPokemonForms, autocompletePokedex, toHyphenFormat } from '../modules/info-module';
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
  isLoading = false; // flag for allowing the start of the next API request
  lastSearch : string | null = ""; // avoid submitting same input more than once

  // PokeAPIService constuctor
  constructor(private pokeAPIService : PokeAPIService) {}

  ngOnInit(){
    // submits form OnInit if form is already filled (used on redirect from Pokedex component to Search component)
    /*
    if (this.textControl.value != ""){
      this.onSubmit();
    }
    */
    
    this.pokeAPIService.getPokedexNational().subscribe((response)=>{
      response.pokemon_entries.forEach((item: any, index: any) => this.nationalPokedex.set(item.pokemon_species.name, item.entry_number));
    },
    (error: any) =>{
      console.log("Failed to retrieve national pokedex")
    },
    () =>{
      autocompletePokedex(this.nationalPokedex); 
      //console.log("national pokedex retrieved");
      //console.log(this.nationalPokedex.get("bulbasaur"));
      //console.log(this.nationalPokedex.get("snivy"));
    });
    
  }
  
  
  onSubmit(): void {
    if (this.isLoading == false){
      if (this.textControl.value != "" && this.lastSearch != this.textControl.value){
        //console.log(this.textControl.value);
        let pokeName = toHyphenFormat(this.textControl.value!.toLowerCase());
        //console.log(pokeName);
        this.lastSearch = pokeName;
        let obsPokeInfo : any;
        let obsPokedexEntry : any;

        // correct names for pokemon with different forms
        const lstPokeNames = correctPokemonForms(pokeName);
        pokeName = lstPokeNames![2];
        obsPokeInfo = this.pokeAPIService.getPokemon(lstPokeNames![0]);
        obsPokedexEntry = this.pokeAPIService.getPokedexEntry(lstPokeNames![1]);

        let obsAbilityDescriptions : any[] = []; // list of observables
        const obsForkJoin1 = forkJoin([obsPokeInfo, obsPokedexEntry]);
        
        // forkJoin() then subscribe to re-sync async API requests and keep the order they were called in
        // response[0] = pokeAPIService.getPokemon(), response[1] = pokeAPIService.getPokedexEntry()
        obsForkJoin1.subscribe((response : any[]) => {
          this.isLoading = true;
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

          // Pokemon Abilties | wait for abilities response, then make poke-info div visible to avoid pop-in
          for (let [index, ability] of response[0].abilities.entries()){
            obsAbilityDescriptions.push(this.pokeAPIService.getAbilityInfo(ability.ability.url));
          }
          // Nested forkJoin()
          let obsForkJoin2 = forkJoin(obsAbilityDescriptions);
          obsForkJoin2.subscribe((response : any[]) => {
            document.getElementById("poke-info-search")!.style.cssText = "display:flex;";
            for (let [index, ability] of response.entries()){
              try{
                setAbilityTooltip(ability.name, ability.effect_entries[1].short_effect);
              }
              catch{
                console.log("no ability description found");
                setAbilityTooltip(ability.name, "");
              }
            }
            this.isLoading = false;
          },
          (error: any) =>{
            document.getElementById("poke-info-search")!.style.cssText = "display:flex;";
            console.log("nested subscribe ability desc error");
            this.isLoading = false;
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
          this.isLoading = false;
        });
      }
    }
    
  }
  

}
