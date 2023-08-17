import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroceryList, GroceryItem } from './models/grocery.models'; // Import the models

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly APIUrl = 'http://127.0.0.1:8000/';
  // readonly APIUrl = 'https://djangogrocery.pythonanywhere.com/';

  constructor(private http: HttpClient) {}

  //+++++++++++++++++++ Grocery List APIs +++++++++++++++++++

  // Get all grocery lists
  getGroceryLists(): Observable<GroceryList[]> {
    return this.http.get<GroceryList[]>(`${this.APIUrl}/grocerylists/`);
  }

  // Get details of a specific grocery list by ID
  getGroceryListDetail(id: number): Observable<GroceryList> {
    return this.http.get<GroceryList>(`${this.APIUrl}/grocerylists/${id}/`);
  }

  // Create a new grocery list
  createGroceryList(groceryList: GroceryList): Observable<GroceryList> {
    return this.http.post<GroceryList>(
      `${this.APIUrl}/grocerylists/`,
      groceryList
    );
  }

  // Update an existing grocery list
  updateGroceryList(
    id: number,
    groceryList: GroceryList
  ): Observable<GroceryList> {
    return this.http.put<GroceryList>(
      `${this.APIUrl}/grocerylists/${id}/`,
      groceryList
    );
  }

  // Delete a grocery list by ID
  deleteGroceryList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.APIUrl}/grocerylists/${id}/`);
  }

  // +++++++++++++++++++ Grocery Item APIs +++++++++++++++++++

  // Get all grocery items for a specific grocery list
  getGroceryItemsForList(listId: number): Observable<GroceryItem[]> {
    return this.http.get<GroceryItem[]>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/`
    );
  }

  // Get details of a specific grocery item by ID within a specific grocery list
  getGroceryItemDetail(
    listId: number,
    itemId: number
  ): Observable<GroceryItem> {
    return this.http.get<GroceryItem>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/${itemId}/`
    );
  }

  // Create a new grocery item within a specific grocery list
  createGroceryItemForList(
    listId: number,
    groceryItem: GroceryItem
  ): Observable<GroceryItem> {
    return this.http.post<GroceryItem>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/`,
      groceryItem
    );
  }

  // Update an existing grocery item within a specific grocery list
  updateGroceryItemForList(
    listId: number,
    itemId: number,
    groceryItem: GroceryItem
  ): Observable<GroceryItem> {
    return this.http.put<GroceryItem>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/${itemId}/`,
      groceryItem
    );
  }

  // Delete a grocery item by ID within a specific grocery list
  deleteGroceryItemForList(listId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/${itemId}/`
    );
  }
}
