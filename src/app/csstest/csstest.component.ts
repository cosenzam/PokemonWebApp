import { Component, OnInit, HostListener} from '@angular/core';
import { PokeAPIService } from '../service/poke-api.service';
import { createCard, correctPokemonForms} from '../modules/info-module';

@Component({
  selector: 'app-csstest',
  templateUrl: './csstest.component.html',
  styleUrls: ['./csstest.component.css']
})
export class CsstestComponent {
  constructor(private pokeAPIService: PokeAPIService) {}

  ngOnInit(){
    /*
    let elCardContainer = <HTMLElement>document.querySelector(".card-container");
    this.pokeAPIService.getPokemon("bulbasaur").subscribe((response : any) => {
        let pokeTypes : string[] = [];
        response.types.forEach((item : any, typeIndex : number) => pokeTypes.push(response.types[typeIndex].type.name));
        const elPokemonCard = createCard("bulbasaur", 1, pokeTypes, response.sprites.front_default);
        elCardContainer.appendChild(elPokemonCard);
    });
    */

  }

}
