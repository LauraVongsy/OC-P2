import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }
 
   openSnackBar(message: string) {
    // Configuration par défaut du Snackbar
    const defaultConfig: MatSnackBarConfig = {
      duration: 3000, 
      horizontalPosition: 'right', 
      verticalPosition: 'top',
    };

    this.snackBar.open(message);
  }

}
