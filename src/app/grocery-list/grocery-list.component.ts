import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroceryList } from '../models/grocery.models';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.css'],
})
export class GroceryListComponent implements OnInit {
  groceryLists: GroceryList[] = [];
  selectedList: GroceryList | null = null;

  groceryForm: FormGroup;
  groceryListFormModal!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private groceryListService: SharedService
  ) {
    this.groceryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
    this.groceryListFormModal = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadGroceryLists();
  }

  loadGroceryLists(): void {
    this.groceryListService.getGroceryLists().subscribe((lists) => {
      this.groceryLists = lists;
      if (this.groceryLists.length > 0) {
        this.loadGroceryItems(this.groceryLists[0]?.id);
      }
    });
  }

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

  openModal(list: GroceryList): void {
    this.selectedList = list;
    this.groceryListFormModal.setValue({
      name: list.name,
      description: list.description || '',
    });
  }

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

  deleteGroceryList(listId: number): void {
    if (confirm('Are you sure?')) {
      this.groceryListService.deleteGroceryList(listId).subscribe(() => {
        this.loadGroceryLists();
      });
    }
  }

  loadGroceryItems(listId: number): void {
    this.selectedList =
      this.groceryLists.find((list) => list.id === listId) || null;
  }
}
