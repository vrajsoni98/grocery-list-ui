// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { GroceryItem, GroceryList } from '../models/grocery.models';
// import { SharedService } from 'src/app/shared.service';

// @Component({
//   selector: 'app-grocery-item',
//   templateUrl: './grocery-item.component.html',
//   styleUrls: ['./grocery-item.component.css'],
// })
// export class GroceryItemComponent implements OnInit {
//   listId!: number;
//   groceryItems: GroceryItem[] = [];
//   newItemName!: string;
//   newItemQuantity!: number;
//   updatingItemId!: number; // Used to track the item being updated

//   constructor(
//     private route: ActivatedRoute,
//     private sharedService: SharedService
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((params) => {
//       this.listId = +params.get('listId')!;
//       this.loadGroceryItems();
//     });
//   }

//   loadGroceryItems(): void {
//     this.sharedService
//       .getGroceryItemsForList(this.listId)
//       .subscribe((items) => {
//         this.groceryItems = items;
//       });
//   }

//   createGroceryItem(): void {
//     const newItem: GroceryItem = {
//       id: 0,
//       name: this.newItemName,
//       quantity: this.newItemQuantity,
//       description: null,
//       purchased: false,
//       grocery_list: {
//         id: this.listId,
//         name: '',
//         description: '',
//       } as GroceryList,
//     };
//     this.sharedService
//       .createGroceryItemForList(this.listId, newItem)
//       .subscribe(() => {
//         this.loadGroceryItems();
//         this.newItemName = ''; // Clear the input fields
//         this.newItemQuantity = 1;
//       });
//   }

//   updateGroceryItem(item: GroceryItem): void {
//     // Ensure that an item is selected for updating
//     if (!item || !item.id) {
//       return;
//     }
//     this.sharedService
//       .updateGroceryItemForList(this.listId, item.id, item)
//       .subscribe(() => {
//         this.loadGroceryItems();
//         //this.updatingItemId = null;
//       });
//   }

//   deleteGroceryItem(itemId: number): void {
//     this.sharedService
//       .deleteGroceryItemForList(this.listId, itemId)
//       .subscribe(() => {
//         this.loadGroceryItems();
//       });
//   }

//   // Start updating a specific item
//   startUpdatingItem(itemId: number): void {
//     this.updatingItemId = itemId;
//   }

//   // Cancel updating the item
//   cancelUpdatingItem(): void {
//     //this.updatingItemId = null;
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SharedService } from '../../shared.service';
import { GroceryItem } from '../models/grocery.models';

@Component({
  selector: 'app-grocery-item',
  templateUrl: './grocery-item.component.html',
  styleUrls: ['./grocery-item.component.css'],
})
export class GroceryItemComponent implements OnInit {
  @Input() listId!: number;
  groceryItems: GroceryItem[] = [];
  newItemName: string = '';
  newItemQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private groceryService: SharedService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.listId = +params.get('listId')!; // Get the listId parameter from the route
          return this.groceryService.getGroceryItemsForList(this.listId);
        })
      )
      .subscribe((items) => {
        this.groceryItems = items;
      });
  }

  createGroceryItem(name: string, quantity: number): void {
    if (name.trim() === '') {
      return;
    }

    const newItem: Partial<GroceryItem> = {
      name: name,
      quantity: quantity,
      // listId: this.listId,
    };

    // Add the listId property separately
    //newItem.listId = this.listId;

    this.groceryService
      .createGroceryItemForList(this.listId, newItem as GroceryItem)
      .subscribe((item) => {
        this.groceryItems.push(item);
        this.newItemName = '';
        this.newItemQuantity = 1;
      });
  }

  updateGroceryItem(item: GroceryItem): void {
    this.groceryService
      .updateGroceryItemForList(this.listId, item.id, item)
      .subscribe(() => {
        // You can handle any UI updates or notifications here
      });
  }

  deleteGroceryItem(item: GroceryItem): void {
    this.groceryService
      .deleteGroceryItemForList(this.listId, item.id)
      .subscribe(() => {
        this.groceryItems = this.groceryItems.filter((i) => i.id !== item.id);
      });
  }
}
