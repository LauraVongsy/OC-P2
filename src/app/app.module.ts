import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BaseChartDirective } from 'ng2-charts';
import { PieChartComponent } from './pages/components/pie-chart/pie-chart.component';
import { LineChartComponent } from './pages/components/line-chart/line-chart.component';
import { CountryComponent } from './pages/country/country.component';

@NgModule({
  declarations: [AppComponent, HomeComponent,NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BaseChartDirective,CountryComponent,  PieChartComponent, LineChartComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
