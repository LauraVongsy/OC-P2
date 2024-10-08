import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { PieChartComponent } from '../components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-home',
  standalone:true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[PieChartComponent]
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<olympic[]> = of([]);
  public numberOfJos:number = 0;
  public numberOfCountries: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
  this.olympics$ = this.olympicService.getOlympics();

  const sub = this.olympics$.subscribe(olympics => {
    this.numberOfJos = olympics.reduce((total, olympic) => olympic.participations.length, 0); //l'accumulateur "total" fait la somme des participations par pays. 

    this.numberOfCountries = olympics.length;
  })
  this.subscription.add(sub);
}
ngOnDestroy(): void {
  this.subscription.unsubscribe(); 
}
}
