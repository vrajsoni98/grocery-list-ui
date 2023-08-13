// src/grocery-list/models/grocery.models.ts

export interface GroceryList {
  id: number;
  name: string;
  description: string | null;
  // Add other properties as needed
}

export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  description: string | null;
  purchased: boolean;
  grocery_list: GroceryList;
  // Add other properties as needed
}
