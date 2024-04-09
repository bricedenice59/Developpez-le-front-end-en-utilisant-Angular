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
import {HeaderComponent} from "./component/header/header.component";
import {FooterComponent} from "./component/footer/footer.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, SpinLoaderComponent, TileInformationComponent, PieChartModule, PieChartTooltipComponent, HeaderComponent, FooterComponent],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
