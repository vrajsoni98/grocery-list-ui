// Grocery List Component TypeScript

import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroceryList } from '../models/grocery.models';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.css'],
})
export class GroceryListComponent implements OnInit {
  // Array to hold the list of grocery lists
  groceryLists: GroceryList[] = [];

  // Currently selected grocery list
  selectedList: GroceryList | null = null;

  // Angular Reactive Form for creating a new grocery list
  groceryForm: FormGroup;

  // Angular Reactive Form for editing a grocery list (modal)
  groceryListFormModal!: FormGroup;

  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private groceryListService: SharedService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    // Initialize the grocery form
    this.groceryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });

    // Initialize the grocery list form used in the modal
    this.groceryListFormModal = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadGroceryLists();
  }

  // Load the list of grocery lists
  loadGroceryLists(): void {
    //Call the services to get the values
    this.groceryListService.getGroceryLists().subscribe((lists) => {
      this.groceryLists = lists;
      if (this.groceryLists.length > 0) {
        this.id = this.groceryLists[0]?.id;
        this.loadGroceryItems(this.id);
        this.router.navigate(['/grocerylist', this.id]);
      }
    });
  }

  // Create a new grocery list
  createGroceryList(): void {
    // Prepare the new grocery list data
    const { name, description } = this.groceryForm.value;
    const newList: Partial<GroceryList> = { name, description: null };
    if (description && description.trim() !== '') {
      newList.description = description;
    }
    // Call the service to create the grocery list
    this.groceryListService
      .createGroceryList(newList as GroceryList)
      .subscribe(() => {
        this.loadGroceryLists();
        this.groceryForm.reset();
      });
  }

  // Open the edit modal for a grocery list
  openModal(list: GroceryList): void {
    this.selectedList = list;
    this.groceryListFormModal.setValue({
      name: list.name,
      description: list.description || '',
    });
  }

  // Edit a grocery list
  editGroceryList(): void {
    if (!this.selectedList) {
      return;
    }

    // Update the selected grocery list with the edited values
    const { name, description } = this.groceryListFormModal.value;
    this.selectedList.name = name;
    this.selectedList.description = description;

    // Call the service to update the grocery list
    this.groceryListService
      .updateGroceryList(this.selectedList.id, this.selectedList)
      .subscribe(() => {
        this.loadGroceryLists();
      });
  }

  // Delete a grocery list
  deleteGroceryList(listId: number): void {
    if (confirm('Are you sure?')) {
      // Call the service to delete the grocery item
      this.groceryListService.deleteGroceryList(listId).subscribe(() => {
        this.loadGroceryLists();
      });
    }
  }

  // Load the items of a specific grocery list
  loadGroceryItems(listId: number): void {
    this.selectedList =
      this.groceryLists.find((list) => list.id === listId) || null;

    // Scroll to the grocery-item component when a card is clicked
    setTimeout(() => {
      const groceryItemComponent = this.elementRef.nativeElement.querySelector(
        '#grocery-item-component'
      );
      if (groceryItemComponent) {
        groceryItemComponent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
