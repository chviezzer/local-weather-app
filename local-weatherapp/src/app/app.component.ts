import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  template: `
  <div>
   <mat-toolbar color="primary"> 
     <span>Local Weather</span>
   </mat-toolbar>
  <div fxLayoutAlign="center"> 
    <div class="mat-caption">
      <h6>Your city, your forecast, rigth now!</h6>
    </div>
  </div>
  <div fxLayoutAlign="center">
  <app-city-search></app-city-search>
  </div>
  <div  fxLayout="row">
    <div fxFlex></div>  
    <div fxFlex="300px">
      <mat-card>
        <mat-card-header>
          <div class="mat-headline">
            Current Weather
          </div>
        </mat-card-header>
        <mat-card-content>
          <app-current-weather></app-current-weather>
        </mat-card-content> 
      </mat-card>
    </div>  
    <div fxFlex></div>  
  </div> 
</div>`,

})

export class AppComponent {

}
