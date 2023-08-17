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

  //Input property for the first list
  @Input() firstId!: number;

  // ID of the current grocery list or first list
  listId: number = this.list?.id || this.firstId;

  // Selected grocery item (for editing)
  selectedItem!: GroceryItem;

  // Array to store the list of grocery items
  groceryItems: GroceryItem[] = [];

  // Form group for creating a new grocery item
  groceryItemForm: FormGroup;

  // Form group for editing a grocery item (used in the modal)
  groceryItemFormModal: FormGroup;

  // Property to hold the filter option
  selectedOption: string = 'all';

  // Property to hold the current sorting option
  currentSortOption: string = 'default';

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
      //Call the services to get the values
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
        this.groceryItems.push(item);
        this.groceryItemForm.reset();
        this.searchQuery = '';
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
        this.searchQuery = '';
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
          this.groceryItems = this.groceryItems.filter((i) => i.id !== item.id);
          this.searchQuery = '';
          this.loadGroceryItems();
        });
    }
  }

  // Method to Mark a grocery item as purchased or not purchased
  markAsPurchased(item: GroceryItem): void {
    const purchasedValue = !item.purchased;
    item.purchased = purchasedValue;

    // Call the service to update the grocery item as purchased
    this.groceryService
      .updateGroceryItemForList(this.listId, item.id, item)
      .subscribe(() => {
        this.loadGroceryItems();
      });
  }

  // Method to handle the change in the dropdown selection
  onFilterChange(selectedValue: string): void {
    this.selectedOption = selectedValue;
  }

  // Method to determine if an item should be hidden based on the selected filter
  shouldHideItem(item: GroceryItem): boolean {
    return this.selectedOption === 'purchased'
      ? !item.purchased
      : this.selectedOption === 'notPurchased'
      ? item.purchased
      : false;
  }

  // Method to handle the change in the sorting selection
  onSortOptionChange(selectedSortOption: string): void {
    this.currentSortOption = selectedSortOption;
    if (selectedSortOption === 'default') {
      this.loadGroceryItems();
    } else if (selectedSortOption === 'name') {
      this.filteredGroceryItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSortOption === 'quantity') {
      this.filteredGroceryItems.sort((a, b) => a.quantity - b.quantity);
    }
  }

  // Method to handle the change in the search input
  onSearchChange(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredGroceryItems = [...this.groceryItems];
    } else {
      this.filteredGroceryItems = this.groceryItems.filter((item) =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}
