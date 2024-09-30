import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, of } from 'rxjs';
import { olympic} from 'src/app/core/models/Olympic';
import { participations } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js'; 
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() countryName: string | null = ''; // Accepter le pays comme Input
  
  public lineChartDatasets: ChartDataset<'line', number[]>[] = [];
  public lineChartLabels: number[] = []; 
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false 
      }
    },
    scales: {
      x: { type: 'category' }, // Les années seront sur l'axe X
      y: {}  // L'axe Y représentera les médailles
    }
  };

  public olympics$: Observable<olympic[]> = of([]);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {

    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);


    this.olympics$ = this.olympicService.getOlympics();

  
    this.olympics$.subscribe((olympics: olympic[]) => {
      if (this.countryName) {
        console.log("countryname", this.countryName)
       
        const selectedOlympic = olympics.find(o => o.country === this.countryName);
        
        if (selectedOlympic) {
          // Extraire les années de participation pour l'axe X
          const years = selectedOlympic.participations.map((participation: participations) => participation.year);

          // Extraire le nombre de médailles pour chaque année
          const medalCounts = selectedOlympic.participations.map((participation: participations) => participation.medalsCount);

          // Mettre à jour les labels (années) et les datasets (nombre de médailles)
          this.lineChartLabels = years;
          this.lineChartDatasets = [
            {
              data: medalCounts,
              borderColor: 'rgba(75, 192, 192, 1)', // Couleur de la ligne
              tension: 0  // Lissage de la ligne
            }
          ];
        }
      }
    });
  }
}
