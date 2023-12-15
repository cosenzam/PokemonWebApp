import { Component, OnInit} from '@angular/core';
import { PokeAPIService } from '../service/poke-api.service';
import { createCard } from '../modules/info-module';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {

  currentIndex = 0; // last pokedex index loaded, for listing more pokemon onscroll
  nationalPokedex = new Map();
  searchInput : string = ""; // sent to search component onClick(searchInput) of a card

  constructor(private pokeAPIService: PokeAPIService) {}

  ngOnInit(){
    /*
    this.pokeAPIService.getPokedexNational().subscribe((response)=>{
      response.pokemon_entries.forEach((item: any, index: any) => this.nationalPokedex.set(item.entry_number, item.pokemon_species.name));
      // create first 16 cards
      for (let i=1; i<=16; i++){
        //createCard(this.nationalPokedex.get(nationalPokedex[i]), i, pokeTypes, urlFrontSprite);
        console.log(this.nationalPokedex.get(i));
      }

    },
    (error: any) =>{
      console.log("Failed to retrieve national pokedex")
    },
    () =>{
      //console.log("national pokedex retrieved");
      //console.log(this.nationalPokedex);
      //console.log(this.nationalPokedex.get("bulbasaur"));
      //console.log(this.nationalPokedex.get("snivy"));
    });
    */
  }

  // load 20 at a time? worst case for large screen sizes

}
