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
    // Load the initial list of grocery lists
    this.loadGroceryLists();
  }

  // Load the list of grocery lists
  loadGroceryLists(): void {
    this.groceryListService.getGroceryLists().subscribe((lists) => {
      this.groceryLists = lists;
      // Load the items of the first list by default (if available)
      if (this.groceryLists.length > 0) {
        this.loadGroceryItems(this.groceryLists[0]?.id);
        this.router.navigate(['/grocerylist', this.groceryLists[0]?.id]);
      }
    });
  }

  // Create a new grocery list
  createGroceryList(): void {
    const { name, description } = this.groceryForm.value;
    const newList: Partial<GroceryList> = { name, description: null };
    if (description && description.trim() !== '') {
      newList.description = description;
    }
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

    // Call the API to update the grocery list (you need to implement this)
    this.groceryListService
      .updateGroceryList(this.selectedList.id, this.selectedList)
      .subscribe(() => {
        // After successful update, close the modal and reload the grocery lists
        this.loadGroceryLists();
      });
  }

  // Delete a grocery list
  deleteGroceryList(listId: number): void {
    if (confirm('Are you sure?')) {
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
