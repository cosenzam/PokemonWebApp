import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Pokemon } from '../interface/pokemon';
import { AbilityInfo } from '../interface/ability-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokeAPIService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  getPokemon(pokemonName: string | null): Observable<Pokemon>{
    return this.http.get<Pokemon>(`${this.apiURL}pokemon/${pokemonName}`);
  }

  getAbilityInfo(abilityURL: string): Observable<AbilityInfo>{
    return this.http.get<AbilityInfo>(abilityURL);
  }

}