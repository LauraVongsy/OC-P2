import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { participations } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';


interface ChartData {
  year: number; 
  medalsCount: number; 
}
@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnDestroy {
  @Input() countryName: string | null = ''; // Accepter le pays comme Input
  datas: ChartData[] = [];
  private subscription: Subscription = new Subscription();  

  public chartOptions: AgChartOptions = {
    data: [], 
    series: [
      {
        type: 'line',
        xKey: 'year', // axe X
        yKey: 'medalsCount', // axe Y
        tooltip: {
          renderer: (params) => {
            return {
              title: '',
              content: `<div>Année: ${params.datum.year}<br>Médailles: ${params.datum.medalsCount}</div>`,
            };
          },
        },
      },
    ],
    axes: [
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Medals',
        },
      },
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Dates',
        },
      },
    ],
    legend: {
      enabled: false,
    },
  };

  public olympics$: Observable<olympic[]> = of([]);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    const sub = this.olympics$.subscribe((olympics: olympic[]) => {
      if (this.countryName) {
        const selectedOlympic = olympics.find(o => o.country === this.countryName);

        if (selectedOlympic) {
          this.datas = selectedOlympic.participations.map((participation: participations) => ({
            year: participation.year, 
            medalsCount: participation.medalsCount, 
          }));

          this.chartOptions = {
            ...this.chartOptions,
            data: this.datas,
          };
        }
      }
    });

    this.subscription.add(sub); //Souscription à sub
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }
}
