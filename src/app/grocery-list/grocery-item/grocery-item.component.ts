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
  @Input() list!: GroceryList;
  listId = this.list?.id;

  selectedItem!: GroceryItem;

  groceryItems: GroceryItem[] = [];
  groceryItemForm: FormGroup;
  groceryItemFormModal: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private groceryService: SharedService,
    private formBuilder: FormBuilder
  ) {
    this.groceryItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });

    this.groceryItemFormModal = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      purchased: [false],
    });
  }

  ngOnInit(): void {
    this.loadGroceryItems();
  }

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
      });
  }

  createGroceryItem(): void {
    if (this.groceryItemForm.invalid) {
      return;
    }

    const newItem: Partial<GroceryItem> = {
      name: this.groceryItemForm.value.name,
      quantity: this.groceryItemForm.value.quantity,
      grocery_list: this.listId,
    };

    this.groceryService
      .createGroceryItemForList(this.listId, newItem as GroceryItem)
      .subscribe((item) => {
        this.groceryItems.push(item);
        this.groceryItemForm.reset(); // Reset the form
        this.groceryItemForm.patchValue({ quantity: 1 }); // Set quantity to 1
      });
  }

  openModal(item: GroceryItem) {
    this.selectedItem = item;
    this.groceryItemFormModal.setValue({
      name: item.name,
      quantity: item.quantity,
      purchased: item.purchased,
    });
  }

  updateGroceryItem(): void {
    if (!this.selectedItem) {
      return;
    }

    // Update the selected grocery item with the edited values
    const { name, quantity, purchased } = this.groceryItemFormModal.value;
    this.selectedItem.name = name;
    this.selectedItem.quantity = quantity;
    this.selectedItem.purchased = purchased;

    // Call the API to update the grocery item
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

  deleteGroceryItem(item: GroceryItem): void {
    if (confirm('Are you sure?')) {
      this.groceryService
        .deleteGroceryItemForList(this.listId, item.id)
        .subscribe(() => {
          this.groceryItems = this.groceryItems.filter((i) => i.id !== item.id);
        });
    }
  }

  markAsPurchased(item: GroceryItem): void {
    const purchasedValue = !item.purchased;
    item.purchased = purchasedValue;
    this.groceryService
      .updateGroceryItemForList(this.listId, item.id, item)
      .subscribe(() => {
        // If needed, you can reload the grocery items after the update
        this.loadGroceryItems();
      });
  }
}
