import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Unit {
  unitCode: string;
  unitName: string;
  unitType: string;
}

@Component({
  selector: 'app-unitcard-container',
  template: `
    <div class="unit-list-container">
      <app-unit-card 
        *ngFor="let unit of units; let i = index"
        [unitCode]="unit.unitCode"
        [unitName]="unit.unitName"
        [unitType]="unit.unitType"
        (infoClicked)="onInfoClicked(i)">
      </app-unit-card>
    </div>
  `,
  styleUrls: ['./unitcard-container.component.css']
})

export class UnitcardContainerComponent {
  units: Unit[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('../../assets/json/pretend-unit-data.json').subscribe(data => {
      this.units = data;
    });
  }

  onInfoClicked(index: number) {
    console.log('Info clicked for unit with index:', index);
  }
}
