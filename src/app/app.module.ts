import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {SpinLoaderComponent} from "./component/spin-loader/spin-loader.component";
import {TileInformationComponent} from "./component/tile-information/tile-information.component";
import {PieChartModule} from "@swimlane/ngx-charts";
import {PieChartTooltipComponent} from "./component/pie-chart-tooltip/pie-chart-tooltip.component";

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, SpinLoaderComponent, TileInformationComponent, PieChartModule, PieChartTooltipComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
