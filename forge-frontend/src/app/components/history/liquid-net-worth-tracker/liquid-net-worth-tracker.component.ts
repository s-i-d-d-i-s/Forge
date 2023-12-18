import { Component, OnInit } from '@angular/core';
import { Expense } from 'src/app/models/Expense.model';
import { DatabaseService } from 'src/app/services/database.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { Stock } from 'src/app/models/Stock.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-liquid-net-worth-tracker',
  templateUrl: './liquid-net-worth-tracker.component.html',
  styleUrls: ['./liquid-net-worth-tracker.component.css']
})
export class LiquidNetWorthTrackerComponent implements OnInit {

  x_data: string[] = [];
  y_data: number[] = [];

  public chartOptions: ChartOptions | undefined;

  constructor(public db: DatabaseService, public auth: AuthenticationService) {
    this.chartOptions = undefined;
  }

  initialize_graph(x_data: any, y_data: any) {
    this.chartOptions = {
      series: [
        {
          name: "Net Worth",
          data: y_data
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: x_data,
        labels: {
          show: false
        }
      }
    };
  }
  ngOnInit(): void {
    this.db.liquid_net_worth_history.subscribe(
      (data) => {
        this.x_data = [];
        this.y_data = [];
        for (let d of data) {
          var date_string = d[0];
          this.y_data.push(+d[1]);
          this.x_data.push(date_string);
        }
        this.initialize_graph(this.x_data, this.y_data);
      }
    )
  }

  formatAmountCurrency(amount: number) {
    var formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: this.get_viewing_currency()!,
    });

    return formatter.format(+amount.toFixed(2)).substring(1);
  }
  get_viewing_currency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }

  get_viewing_currency_symbol() {
    if (this.get_viewing_currency() == 'INR') {
      return '₹'
    } else if (this.get_viewing_currency() == 'EUR') {
      return '€';
    }
    return '$';
  }

}
