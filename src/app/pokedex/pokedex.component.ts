import { Component, OnInit, HostListener} from '@angular/core';
import { PokeAPIService } from '../service/poke-api.service';
import { createCard, correctPokemonForms} from '../modules/info-module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {

  currentIndex = 1; // last pokedex index loaded, for listing more pokemon onscroll
  pokedexMap = new Map();
  searchInput : string = ""; // sent to search component onClick(searchInput) of a card
  isLoading = false;
  queueCards = []; // list of observables queued if needed?
  infiniteScrolling = false;
  // Either scale cards for window/screen sizes or load more cards
  // Can use (document.body.offsetHeight > some number) to check for large height screens that might trigger more than one onScroll event at once
  // isLoading flag should prevent multiple requests at once but not sure how to test?

  constructor(private pokeAPIService: PokeAPIService) {}

  ngOnInit(){
    if (this.isLoading == false){
      this.pokeAPIService.getPokedexNational().subscribe((response)=>{
        this.isLoading = true;
        response.pokemon_entries.forEach((item: any, index: number) => this.pokedexMap.set(item.entry_number, item.pokemon_species.name));
        // create first 16 cards
        let lstObsPokemon : any[] = []; // Observable<Pokemon>[]
        this.loadCards(lstObsPokemon, 16);
      },
      (error: any) =>{
        console.log("Failed to retrieve national pokedex")
        this.isLoading = false;
      },
      () =>{
        //console.log("national pokedex retrieved");
        //console.log(this.pokedexMap);
      });
    }
  }

  onClickToggleOnScroll(){
    if (this.infiniteScrolling == false){
      this.infiniteScrolling = true;
      document.getElementById("infinite-scroll-btn-wrapper")!.remove();
    }
    else{
      console.log("infinite scrolling already toggled");
    }
  }

  @HostListener("window:scroll", [])
  onScroll(){
    let scrollPosY = window.innerHeight + window.scrollY;
    let windowHeight = document.body.offsetHeight;
    //console.log(scrollPosY, windowHeight);

    if (scrollPosY >= windowHeight && this.infiniteScrolling == true){
      //console.log(scrollPosY, windowHeight);
      //console.log("triggered");

      if (this.isLoading == false && this.currentIndex <= 1017){
        this.isLoading = true;
        let lstObsPokemon : any[] = []; // Observable<Pokemon>[]
        this.loadCards(lstObsPokemon, 16);
      }
      else{
        console.log("already loading or max pokedex # reached");
      }
    }
  }

  loadCards(lstObsPokemon : any[], numToLoad : number){

    for (let i=this.currentIndex; i < this.currentIndex + numToLoad && i <= 1017; i++){
      // API request for first 16 cards (4 rows)
      let pokeName = correctPokemonForms(this.pokedexMap.get(i))![0];
      lstObsPokemon.push(this.pokeAPIService.getPokemon(pokeName));
    }
    let elCardContainer = <HTMLElement>document.querySelector(".card-container");
    // forkJoin() to re-sync lstObsPokemon then create cards
    const obsForkJoin = forkJoin(lstObsPokemon);

    obsForkJoin.subscribe((response : any[]) => {
      response.forEach((jsonResponse: any, index: number) => {
        let pokeTypes : string[] = [];
        jsonResponse.types.forEach((item : any, typeIndex : number) => pokeTypes.push(jsonResponse.types[typeIndex].type.name));
        const elPokemonCard = createCard(this.pokedexMap.get(this.currentIndex), this.currentIndex, pokeTypes, jsonResponse.sprites.front_default);
        elCardContainer.appendChild(elPokemonCard);
        this.currentIndex++;
      })
      this.isLoading = false;
    },
    (error : any) => {
      console.log("API request error");
    },
    () =>{

    });
  }

}
