import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';
import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';

export const routes: Routes = [
    { path: '', component: CharacterListComponent },
    { path: 'favorites', component: FavoriteListComponent },
    { path: 'character/:id', component: CharacterDetailComponent },
    { path: '**', redirectTo: '' }
];
