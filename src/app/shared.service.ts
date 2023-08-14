import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroceryList, GroceryItem } from './models/grocery.models'; // Import the models

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly APIUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {}

  // Grocery List APIs
  getGroceryLists(): Observable<GroceryList[]> {
    return this.http.get<GroceryList[]>(`${this.APIUrl}/grocerylists/`);
  }

  getGroceryListDetail(id: number): Observable<GroceryList> {
    return this.http.get<GroceryList>(`${this.APIUrl}/grocerylists/${id}/`);
  }

  createGroceryList(groceryList: GroceryList): Observable<GroceryList> {
    return this.http.post<GroceryList>(
      `${this.APIUrl}/grocerylists/`,
      groceryList
    );
  }

  updateGroceryList(
    id: number,
    groceryList: GroceryList
  ): Observable<GroceryList> {
    return this.http.put<GroceryList>(
      `${this.APIUrl}/grocerylists/${id}/`,
      groceryList
    );
  }

  deleteGroceryList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.APIUrl}/grocerylists/${id}/`);
  }

  // Grocery Item APIs
  getGroceryItemsForList(listId: number): Observable<GroceryItem[]> {
    return this.http.get<GroceryItem[]>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/`
    );
  }

  getGroceryItemDetail(
    listId: number,
    itemId: number
  ): Observable<GroceryItem> {
    return this.http.get<GroceryItem>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/${itemId}/`
    );
  }

  createGroceryItemForList(
    listId: number,
    groceryItem: GroceryItem
  ): Observable<GroceryItem> {
    return this.http.post<GroceryItem>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/`,
      groceryItem
    );
  }

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

  deleteGroceryItemForList(listId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.APIUrl}/grocerylists/${listId}/groceryitems/${itemId}/`
    );
  }

  getAllGroceryListNames(): Observable<GroceryList[]> {
    return this.http.get<GroceryList[]>(`${this.APIUrl}/grocerylists/`);
  }
}
