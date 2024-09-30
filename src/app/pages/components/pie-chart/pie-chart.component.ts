import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, of } from 'rxjs';
import { olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})

export class PieChartComponent implements OnInit {
  public pieChartLabels: string[] = [];
  public pieChartDatasets: ChartDataset<'pie', number[]>[] = [];
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  }

  public olympics$: Observable<olympic[]> = of([]);

  constructor(private olympicService: OlympicService , private router: Router) {}

  ngOnInit(): void {
   
    Chart.register(PieController, ArcElement, Tooltip, Legend);

  
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe(olympics => {
      this.pieChartLabels = olympics.map(olympic => olympic.country);

      const medalCounts = olympics.map(olympic => {
        return olympic.participations.reduce((sum, participation)=> {
          return sum +(participation.medalsCount);
        },0);
      });
      
      this.pieChartDatasets = [
        {
          data: medalCounts,
          backgroundColor: ['#956064', '#b8cbe8', '#c0e0f2', '#9780a1', '#89a1dc'],
          label: `🏅`
        }
      ];
    });
  }
  onChartClick(event: any): void {
    // Accéder à l'élément actif
    const activePoints = event.active;
  
    if (activePoints.length > 0) {
      const index = activePoints[0].index; // Obtenir l'index du segment cliqué
      const selectedCountry = this.pieChartLabels[index]; // Obtenir le pays correspondant à l'index
      console.log("country", selectedCountry);
  

      this.router.navigate(['/country', selectedCountry]); 
    }
  }
}
