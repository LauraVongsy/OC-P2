import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<olympic[]> = of([]);
  public numberOfJos:number = 0;
  public numberOfCountries: number = 0;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
  this.olympics$ = this.olympicService.getOlympics();

  this.olympics$.subscribe(olympics => {
    this.numberOfJos = olympics.reduce((total, olympic) => olympic.participations.length, 0);

    this.numberOfCountries = olympics.length;
  })

}

}
