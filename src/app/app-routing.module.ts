import { HomeGameComponent } from './home-game/home-game.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //{ path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home/play/:gameId', component: PlayGameComponent },
  { path: 'home', component: HomeGameComponent },
  { path: '', component: AppComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
