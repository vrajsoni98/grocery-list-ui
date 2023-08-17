import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroceryListComponent } from './grocery-list/grocery-list.component';
import { GroceryItemComponent } from './grocery-list/grocery-item/grocery-item.component';

const routes: Routes = [
  { path: '', redirectTo: '/grocerylist', pathMatch: 'full' },
  { path: 'grocerylist', component: GroceryListComponent },
  { path: 'grocerylist/:listId', component: GroceryListComponent }, // Dynamic route with :listId parameter
  {
    path: 'grocerylist/:listId/groceryitem',
    redirectTo: '/grocerylist',
    pathMatch: 'full',
  }, // Redirect to GroceryListComponent
  {
    path: 'grocerylist/:listId/groceryitem/:itemId',
    component: GroceryItemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
