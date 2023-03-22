import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-net-worth-tracker',
  templateUrl: './net-worth-tracker.component.html',
  styleUrls: ['./net-worth-tracker.component.css']
})
export class NetWorthTrackerComponent implements OnInit {

  x_data : string[] = [];
  y_data : number[] = [];
  MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];


  public chartOptions: ChartOptions | undefined;

  constructor(public db: DatabaseService) {
    this.chartOptions = undefined;
  //  this.initialize_graph(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"],[10, 41, 35, 51, 49, 62, 69, 91, 148]);
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
    this.db.totalExpenses.subscribe(
      (expenses) => {
        this.db.investments.subscribe(
          (stocks) => {
            expenses.sort(
              (a: Expense, b: Expense) => {
                var result = (new Date(a.timestamp)).getTime() < (new Date(b.timestamp)).getTime();
                if (result) return -1;
                return 1;
              }
            )
            stocks.sort(
              (a: Stock, b: Stock) => {
                var result = (new Date(a.timestamp)).getTime() < (new Date(b.timestamp)).getTime();
                if (result) return -1;
                return 1;
              }
            )

            var data: [number,Date][]=[];

            for(let expense of expenses){
              var date = expense.timestamp;
              data.push([(expense.amountType == "Credit" ? 1:-1)*(expense.amount),date]);
            }

            for(let stock of stocks){
              var date =  stock.timestamp;
              console.log(stock);
              data.push([stock.amount*stock.price!,date]);
            }

            data.sort(
              (a:[number,Date],b:[number,Date]) => {
                var result = (new Date(a[1])).getTime() < (new Date(b[1])).getTime();
                if (result) return -1;
                return 1;
              }
            )
            this.x_data = [];
            this.y_data = [];
            var net_worth = 0;
            for(let d of data){
              var date_string = this.getDate(d[1]);
              net_worth = net_worth + d[0];
              console.log(d);
              this.y_data.push(this.formatAmount(net_worth));
              this.x_data.push(date_string);
            }
            this.initialize_graph(this.x_data,this.y_data);
          }
        )        
      }
    )
  }

  getDate(timestamp:Date){
    return (new Date(timestamp)).getDate() + ' ' + this.MONTHS[ +((new Date(timestamp)).getMonth()) ] +  ' ' + (new Date(timestamp)).getFullYear()
  }
  formatAmount(amount:number):number{
    return +amount.toFixed(0);
  }
  formatAmountCurrency(amount:number){
    var formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: this.getViewingCurrency()!,
    });
    
    return formatter.format(+amount.toFixed(2)).substring(1);
  }
  getViewingCurrency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }
}
