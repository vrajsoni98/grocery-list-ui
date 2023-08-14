// src/grocery-list/models/grocery.models.ts

export interface GroceryList {
  id: number;
  name: string;
  description: string | null;
  created_on: Date;
  // Add other properties as needed
}

export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  description: string | null;
  purchased: boolean;
  created_on: Date;
  grocery_list: number;
  // Add other properties as needed
}
