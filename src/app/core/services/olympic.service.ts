import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { olympic } from '../models/Olympic';
import { SnackbarService } from './snackbar.service'; 

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<olympic[]>([]); // Permet d'émettre les données quand elles changent

  constructor(private http: HttpClient, private snackbarService: SnackbarService) {}

  loadInitialData() {
    return this.http.get<olympic[]>(this.olympicUrl).pipe(// ici pipe permet d'utiliser des opérateurs rxJs
      tap((value) => this.olympics$.next(value)),// tap permet d'exécuter une fonction pour chaque valeur émise par l'observable
      catchError((error: Error) => {
        console.error(error);
        this.snackbarService.openSnackBar('Une erreur s\'est produite lors du chargement des données.');
        this.olympics$.next([]); // Réinitialise les données
        return throwError(() => error); // Rejette l'erreur pour la gestion ultérieure
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
