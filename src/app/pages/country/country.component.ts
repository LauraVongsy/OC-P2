import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [LineChartComponent, RouterModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit {
  public countryName: string | null = null;
  public olympicData: olympic | null = null;
  public olympics$: Observable<olympic[]> = of([]);
  public medalCount:number=0;
  public athleteCount:number=0;

  private subscription: Subscription = new Subscription();


  constructor(private route: ActivatedRoute , private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Récupérer le pays depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('country'); 
      
      // Charger les données olympiques et filtrer par pays
      this.olympics$ = this.olympicService.getOlympics();
     const sub = this.olympics$.subscribe(olympics => {
        this.olympicData = olympics.find(olympic => olympic.country === this.countryName) || null;
      });
      if(this.olympicData){
        const medals = this.olympicData.participations.reduce((sum, participation)=> {
          return sum +(participation.medalsCount);
        },0);
        this.medalCount= medals

        const athletes = this.olympicData.participations.reduce((sum, participation)=> {
          return sum +(participation.athleteCount);
        },0);
        this.athleteCount= athletes
      }
      this.subscription.add(sub);
    });
    
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }
}