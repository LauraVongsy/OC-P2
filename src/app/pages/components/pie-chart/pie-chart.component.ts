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
        angleKey: 'countryMedals', //Gère les parts du diagramme
        calloutLabelKey: 'countryName',//Gère les labels du diagramme       
        calloutLine: {length: 30, strokeWidth: 2}, // Gère les traits des labels      
        fills: ['#793d54', '#956064', '#b8cbe8', '#c0e0f2', '#9780a1', '#89a1dc'], 
        highlightStyle: {
          item: {
            strokeWidth: 0, // Supprime la bordure en survol
            stroke: undefined, 
          }
        },
        tooltip: {// Gère les données au hover
          renderer(params) {            
            return `<div class="ag-chart-tooltip" style="position: relative; width: 100px; text-align: center;">
              <div class="ag-chart-tooltip-title" style="background-color: #25828f; color: white; padding-top: 5px; ">
              ${params.datum[params.calloutLabelKey!]}
              </div>
              <div class="ag-chart-tooltip-content" style="background-color: #25828f; color: white;">
              🏅 ${Math.round(params.datum[params.angleKey])}
              </div>
              <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #25828f; position: absolute;
              bottom: -10px; left: 50%; transform: translateX(-50%);"></div>
              </div>
            `
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
