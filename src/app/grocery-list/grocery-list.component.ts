import { Component, ElementRef, Input } from '@angular/core';
import { GroceryList } from './models/grocery.models';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.css'],
})
export class GroceryListComponent {
  groceryLists: GroceryList[] = [];

  ModalTitle!: string;

  selectedList!: GroceryList;
  groceryListName!: string;
  groceryListDescription!: string | null;

  descriptionInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private groceryListService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroceryLists();
  }

  // ngAfterViewInit(): void {
  //   // Access the input fields here, they are guaranteed to be defined after the view is initialized
  //   console.log(this.nameInputRef);
  //   console.log(this.descriptionInputRef);
  // }

  loadGroceryLists(): void {
    this.groceryListService.getGroceryLists().subscribe((lists) => {
      this.groceryLists = lists;
    });
  }

  createGroceryList(name: string, description: string | null): void {
    const newList: Partial<GroceryList> = { name, description: null };
    if (description !== null && description.trim() !== '') {
      newList.description = description;
    }
    this.groceryListService
      .createGroceryList(newList as GroceryList)
      .subscribe(() => {
        this.loadGroceryLists();
      });
  }

  editGroceryList(): void {
    // Update the selected grocery list with the edited values
    if (this.selectedList) {
      this.selectedList.name = this.groceryListName;
      this.selectedList.description = this.groceryListDescription;

      // Call the API to update the grocery list (you need to implement this)
      this.groceryListService
        .updateGroceryList(this.selectedList.id, this.selectedList)
        .subscribe(() => {
          // After successful update, close the modal and reload the grocery lists
          this.loadGroceryLists();
        });
    }
  }

  deleteGroceryList(listId: number): void {
    if (confirm('Are you sure??')) {
      this.groceryListService.deleteGroceryList(listId).subscribe(() => {
        this.loadGroceryLists();
      });
    }
  }

  openModal(list: GroceryList) {
    this.selectedList = list;
    this.groceryListName = list.name;
    this.groceryListDescription = list.description;
  }

  loadGroceryItems(listId: number): void {
    //this.router.navigate(['/grocerylist', listId, 'groceryitem']);
    this.selectedList = this.groceryLists.find((list) => list.id === listId)!;
  }
}
