import { Component, OnInit} from '@angular/core';
import { PokeAPIService } from '../service/poke-api.service';
import { createCard } from '../modules/info-module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {

  currentIndex = 0; // last pokedex index loaded, for listing more pokemon onscroll
  pokedexMap = new Map();
  searchInput : string = ""; // sent to search component onClick(searchInput) of a card

  constructor(private pokeAPIService: PokeAPIService) {}

  ngOnInit(){
    let lstObsPokemon : any[] = []; // Observable<Pokemon>[]
  
    this.pokeAPIService.getPokedexNational().subscribe((response)=>{
      response.pokemon_entries.forEach((item: any, index: number) => this.pokedexMap.set(item.entry_number, item.pokemon_species.name));
      // create first 16 cards
      for (let i=1; i<=16; i++){
        // API request for first 16 cards (4 rows)
        lstObsPokemon.push(this.pokeAPIService.getPokemon(this.pokedexMap.get(i)));
        console.log(typeof(this.pokedexMap.get(i)));
      }
      let elCardContainer = <HTMLElement>document.querySelector(".card-container");
      // forkJoin() lstObsPokemon then create cards
      const obsForkJoin = forkJoin(lstObsPokemon);

      obsForkJoin.subscribe((response : any[]) => {
        for (let i = 0; i<=15; i++){
          this.currentIndex++;
          let pokeTypes : string[] = [];
          response[i].types.forEach((item : any, index : number) => pokeTypes.push(response[i].types[index].type.name));
          const elPokemonCard = createCard(this.pokedexMap.get(this.currentIndex), this.currentIndex, pokeTypes, response[i].sprites.front_default);
          elCardContainer.appendChild(elPokemonCard);
        }
      },
      (error : any) => {
        console.log("API request error");
      });

    },
    (error: any) =>{
      console.log("Failed to retrieve national pokedex")
    },
    () =>{
      //console.log("national pokedex retrieved");
      //console.log(this.pokedexMap);
      //console.log(this.pokedexMap.get(1));
      //console.log(this.pokedexMap.get(363));
    });

  }

  // Either scale cards for window/screen sizes or load more cards

}
