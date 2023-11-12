import { Component, OnInit } from '@angular/core';
import { closeNav, openNav } from './modules/nav-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular';

  ngOnInit(): void {
    
  }

  closeNavbar(){
    closeNav();
  }

  openNavbar(){
    openNav();
  }

}
