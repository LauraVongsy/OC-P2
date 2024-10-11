import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }
 
   openSnackBar(message: string) {
    const defaultConfig: MatSnackBarConfig = {
      duration: 3000, 
      horizontalPosition: 'center', 
      verticalPosition: 'bottom',
    };
    this.snackBar.open(message);
  }

}
