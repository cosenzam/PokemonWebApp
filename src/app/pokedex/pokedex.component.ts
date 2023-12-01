import { Component, OnInit} from '@angular/core';
import { PokeAPIService } from '../service/poke-api.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {

  currentIndex = 0; // last pokedex index loaded, for listing more pokemon onscroll
  nationalPokedex = new Map();

  constructor(private pokeAPIService: PokeAPIService) {}

  ngOnInit(){
    /*
    this.pokeAPIService.getPokedexNational().subscribe((response)=>{
      response.pokemon_entries.forEach((item: any, index: any) => this.nationalPokedex.set(item.pokemon_species.name, item.entry_number));
    },
    (error: any) =>{
      console.log("Failed to retrieve national pokedex")
    },
    () =>{
      console.log("national pokedex retrieved");
      console.log(this.nationalPokedex);
      console.log(this.nationalPokedex.get("bulbasaur"));
      console.log(this.nationalPokedex.get("snivy"));
    });
    */
  }

  // load 20 at a time? worst case for large screen sizes


}
