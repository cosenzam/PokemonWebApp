import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Pokemon } from '../interface/pokemon';
import { AbilityInfo } from '../interface/ability-info';
import { PokedexEntry } from '../interface/pokedex-entry';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokeAPIService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  // would be nice to return a list of different Observables in a single function
  getPokemon(pokemonName: string | null): Observable<Pokemon>{
    return this.http.get<Pokemon>(`${this.apiURL}pokemon/${pokemonName}`);
  }

  getAbilityInfo(abilityURL: string): Observable<AbilityInfo>{
    return this.http.get<AbilityInfo>(abilityURL);
  }

  getPokedexEntry(pokemonName: string | null): Observable<PokedexEntry>{
    return this.http.get<PokedexEntry>(`${this.apiURL}pokemon-species/${pokemonName}`);
  }

}