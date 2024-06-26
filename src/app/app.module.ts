import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { PokemonSearchComponent } from './pokemon-search/pokemon-search.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { PokedexComponent } from './pokedex/pokedex.component';
import { CsstestComponent } from './csstest/csstest.component';

const appRoute: Routes = [
  { path: '', component: PokemonSearchComponent /*HomeComponent*/},
  { path: 'search', component: PokemonSearchComponent},
  { path: 'team', component: CreateTeamComponent},
  { path: 'about', component: AboutComponent},
  { path: 'pokedex', component: PokedexComponent},
  { path: 'csstest', component: CsstestComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    PokemonSearchComponent,
    CreateTeamComponent,
    AboutComponent,
    HomeComponent,
    PokedexComponent,
    CsstestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoute),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
