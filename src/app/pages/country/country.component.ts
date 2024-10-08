import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartComponent } from '../components/line-chart/line-chart.component';


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


  constructor(private route: ActivatedRoute , private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Récupérer le pays depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('country'); // Obtenir le nom du pays
      console.log("Selected Country: ", this.countryName);
      
      // Charger les données olympiques et filtrer par pays
      this.olympics$ = this.olympicService.getOlympics();
      this.olympics$.subscribe(olympics => {
        this.olympicData = olympics.find(olympic => olympic.country === this.countryName) || null;
        console.log("Olympic Data for country: ", this.olympicData);
      });
      if(this.olympicData){
        const medals = this.olympicData.participations.reduce((sum, participation)=> {
          return sum +(participation.medalsCount);
        },0);
        console.log("medalcount", medals)
        this.medalCount= medals

        const athletes = this.olympicData.participations.reduce((sum, participation)=> {
          return sum +(participation.athleteCount);
        },0);
        this.athleteCount= athletes
      }
      
    });
    
  }
}