import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ui';
  currentDate: Date | undefined;
  currentTime: Date | undefined;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.updateDateTime();
    // Update the date and time every second
    setInterval(() => this.updateDateTime(), 1000);
  }

  updateDateTime(): void {
    this.currentDate = new Date();
    this.currentTime = new Date();
  }
}
