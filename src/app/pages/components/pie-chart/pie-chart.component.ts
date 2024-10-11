import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';


interface ChartData {
  countryName: string; 
  countryMedals: number; 
}


@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './pie-chart.component.html',
})
export class PieChartComponent implements OnInit {
  datas: ChartData[] = [];

  private subscription: Subscription = new Subscription(); 

  public chartOptions: AgChartOptions = {
    data: [], // Initialisation des données vides

    series: [
      {
        type: 'pie',
        angleKey: 'countryMedals',
        calloutLabelKey: 'countryName',
        legendItemKey: 'countryName',
        fills: ['#793d54', '#956064', '#b8cbe8', '#c0e0f2', '#9780a1', '#89a1dc'], 
        tooltip: {
          renderer(params) {
            return {
              title: '',
              content: `<div style="background-color: #25828f; color: white; padding:10px; border-radius:5px;">🏅 ${Math.round(params.datum[params.angleKey])}</div>`,
            };
          }
        },
        listeners: {
          nodeClick: (event) => this.onSelect(event),
        },
      },
    ],

    legend: {
      enabled: false,
    },
  
  };

  public olympics$: Observable<olympic[]> = of([]);

  constructor(
    private olympicService: OlympicService,
    private router: Router,
   
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    const sub = this.olympics$.subscribe((olympics) => {
      this.datas = olympics.map((olympic) => {
        const totalMedals = olympic.participations.reduce(
          (sum, participation) => sum + participation.medalsCount,
          0
        );

        return {
          countryName: olympic.country, 
          countryMedals: totalMedals, 
        };
      });

      // Mettre à jour chartOptions avec un nouvel objet
      this.chartOptions = {
        ...this.chartOptions,
        data: this.datas,
      };

    });
    this.subscription.add(sub);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }

  onSelect(event: any): void {
    const selectedCountry = event.datum.countryName; 
    this.router.navigate(['/country', selectedCountry]); 
  }
}
