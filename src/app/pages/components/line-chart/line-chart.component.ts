import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { participations } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input() countryName: string | null = ''; // Accepter le pays comme Input
  datas: any[] = [];

  public chartOptions: AgChartOptions = {
    data: [], // On initialise les données vides
    series: [
      {
        type: 'line',
        xKey: 'year', // Clé pour l'axe X
        yKey: 'medalsCount', // Clé pour l'axe Y
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
        type: 'number', // Modifiez ici si vous utilisez un graphique polaire
        position: 'left',
        title: {
          text: 'Medals', // Correctly formatted title object
        },
      },
      {
        type: 'category', // Modifiez ici si vous utilisez un graphique polaire
        position: 'bottom',
        title: {
          text: 'Dates', // Correctly formatted title object
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

    this.olympics$.subscribe((olympics: olympic[]) => {
      if (this.countryName) {
        const selectedOlympic = olympics.find(o => o.country === this.countryName);

        if (selectedOlympic) {
          // Extraire les données pour le graphique
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
  }
}
