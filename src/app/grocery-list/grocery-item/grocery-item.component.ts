// Grocery Item Component TypeScript

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SharedService } from '../../shared.service';
import { GroceryItem, GroceryList } from '../../models/grocery.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grocery-item',
  templateUrl: './grocery-item.component.html',
  styleUrls: ['./grocery-item.component.css'],
})
export class GroceryItemComponent implements OnInit {
  // Input property for the current grocery list
  @Input() list!: GroceryList;
  // ID of the current grocery list
  listId = this.list?.id;

  // Selected grocery item (for editing)
  selectedItem!: GroceryItem;

  // Array to store the list of grocery items
  groceryItems: GroceryItem[] = [];

  // Form group for creating a new grocery item
  groceryItemForm: FormGroup;

  // Form group for editing a grocery item (used in the modal)
  groceryItemFormModal: FormGroup;

  // Drop down Filter
  selectedOption: string = 'all';

  // Property to hold the current sorting option
  currentSortOption: string = 'name';

  // Property to hold the search query
  searchQuery: string = '';

  // Property to hold the filtered grocery items
  filteredGroceryItems: GroceryItem[] = [];

  // Constructor for initializing the component
  constructor(
    private route: ActivatedRoute,
    private groceryService: SharedService,
    private formBuilder: FormBuilder
  ) {
    // Initialize the grocery item form
    this.groceryItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    // Initialize the grocery item form used in the modal
    this.groceryItemFormModal = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      purchased: [false],
    });
  }

  ngOnInit(): void {
    // Load the grocery items for the current list
    this.loadGroceryItems();
  }

  // Load the grocery items for the current list
  loadGroceryItems(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.listId = +params.get('listId')!;
          return this.groceryService.getGroceryItemsForList(this.listId);
        })
      )
      .subscribe((items) => {
        this.groceryItems = items;

        this.filteredGroceryItems = [...this.groceryItems];
      });
  }

  // Create a new grocery item
  createGroceryItem(): void {
    if (this.groceryItemForm.invalid) {
      return;
    }

    // Prepare the new grocery item data
    const newItem: Partial<GroceryItem> = {
      name: this.groceryItemForm.value.name,
      quantity: this.groceryItemForm.value.quantity,
      grocery_list: this.listId,
    };

    // Call the service to create the grocery item
    this.groceryService
      .createGroceryItemForList(this.listId, newItem as GroceryItem)
      .subscribe((item) => {
        // Add the new item to the displayed grocery items
        this.groceryItems.push(item);
        // Reset the form after successful item creation
        this.groceryItemForm.reset();
        this.loadGroceryItems();
      });
  }

  // Open the edit modal for a grocery item
  openModal(item: GroceryItem) {
    this.selectedItem = item;
    // Set the values in the modal form
    this.groceryItemFormModal.setValue({
      name: item.name,
      quantity: item.quantity,
      purchased: item.purchased,
    });
  }

  // Update a grocery item
  updateGroceryItem(): void {
    if (!this.selectedItem) {
      return;
    }

    // Update the selected grocery item with the edited values
    const { name, quantity, purchased } = this.groceryItemFormModal.value;
    this.selectedItem.name = name;
    this.selectedItem.quantity = quantity;
    this.selectedItem.purchased = purchased;

    // Call the service to update the grocery item
    this.groceryService
      .updateGroceryItemForList(
        this.listId,
        this.selectedItem.id,
        this.selectedItem
      )
      .subscribe(() => {
        // After successful update, close the modal and reload the grocery items
        this.loadGroceryItems();
      });
  }

  // Delete a grocery item
  deleteGroceryItem(item: GroceryItem): void {
    if (confirm('Are you sure?')) {
      // Call the service to delete the grocery item
      this.groceryService
        .deleteGroceryItemForList(this.listId, item.id)
        .subscribe(() => {
          // Remove the item from the displayed grocery items
          this.groceryItems = this.groceryItems.filter((i) => i.id !== item.id);
          this.loadGroceryItems();
        });
    }
  }

  // Mark a grocery item as purchased or not purchased
  markAsPurchased(item: GroceryItem): void {
    // Toggle the purchased status
    const purchasedValue = !item.purchased;
    item.purchased = purchasedValue;

    // Call the service to update the grocery item's purchased status
    this.groceryService
      .updateGroceryItemForList(this.listId, item.id, item)
      .subscribe(() => {
        // If needed, you can reload the grocery items after the update
        this.loadGroceryItems();
      });
  }

  // Method to handle the change in the dropdown selection
  onDropdownChange(selectedValue: string): void {
    this.selectedOption = selectedValue;
  }

  // Method to determine if an item should be hidden based on the selected filter
  shouldHideItem(item: GroceryItem): boolean {
    if (this.selectedOption === 'all') {
      return false;
    } else if (this.selectedOption === 'purchased') {
      return !item.purchased;
    } else if (this.selectedOption === 'notPurchased') {
      return item.purchased;
    }
    return false;
  }

  // Method to handle sorting based on the selected sorting option
  sortGroceryItems(): void {
    if (this.currentSortOption === 'default') {
      this.loadGroceryItems();
    } else if (this.currentSortOption === 'name') {
      this.groceryItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.currentSortOption === 'quantity') {
      this.groceryItems.sort((a, b) => a.quantity - b.quantity);
    }
  }

  // Method to handle the change in the sorting selection
  onSortOptionChange(selectedSortOption: string): void {
    this.currentSortOption = selectedSortOption;
    this.sortGroceryItems(); // Call the sorting method
  }

  // Method to handle the change in the search input
  onSearchChange(): void {
    if (this.searchQuery.trim() === '') {
      // If search query is empty, show all items
      this.filteredGroceryItems = [...this.groceryItems];
    } else {
      this.filteredGroceryItems = this.groceryItems.filter((item) =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}
