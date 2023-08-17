# Grocery List Application

The Grocery List Application is designed for single-user usage, ideally tailored for a family. It allows users to manage their grocery lists and items, perform CRUD (Create, Read, Update, Delete) operations, and enhance their shopping experience with features like marking items as purchased, sorting, filtering, and searching.

## Features

- Create, Read, Update, and Delete grocery lists.
- Create, Read, Update, and Delete grocery items within each list.
- Mark items as purchased to keep track of shopping progress.
- Perform Search, Sort, and Filter operations on grocery items.

## Getting Started

### Prerequisites

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/) (with npm)
- [Angular CLI](https://angular.io/cli)

### Installation

1. Clone the repository: git clone https://github.com/vrajsoni98/grocery-list-ui

2. Navigate to the project directory: cd grocery-list-ui

3. Install Angular CLI: npm install -g @angular/cli

4. Install project dependencies: npm install

5. In the shared services file (`src/app/shared.service.ts`), set the `APIUrl` to localhost. The correct localhost URL is provided in a comment.
   private APIUrl = 'http://localhost:8000';

6. Start the development server: ng serve --o

## Usage

Access the application by opening a web browser and navigating to `http://localhost:4200`.

- Create and manage your grocery lists and items using the intuitive user interface.
- Explore the various features like marking items as purchased, sorting by name or quantity, and filtering purchased or non-purchased items.
- Experience seamless searching, sorting, and filtering to enhance your grocery shopping planning.

## Backend API

This repository contains only the frontend part of the application. To fully utilize the app's capabilities, make sure you have the Backend API running or use the hosted API provided:

- Backend API Repository: [grocery-list-api](https://github.com/vrajsoni98/grocery-list-api)
- Hosted API: [https://djangogrocery.pythonanywhere.com](https://djangogrocery.pythonanywhere.com)

## Demo

Check out the working demo of the Grocery List Application: [https://vrajsoni98.github.io/grocery-list-ui/](https://vrajsoni98.github.io/grocery-list-ui/)

Designed and developed by Vraj Soni
