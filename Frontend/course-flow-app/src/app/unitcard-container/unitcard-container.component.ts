import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Unit } from '../interfaces/unit.model';

@Component({
  selector: 'app-unitcard-container',
  templateUrl: `./unitcard-container.component.html`,
  styleUrls: ['./unitcard-container.component.css']
})

export class UnitcardContainerComponent implements OnInit {
  units: Unit[] = [];
  groupedUnits: Unit[][] = [];

  @Input() containerNumber: number = 1;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Unit[]>('../../assets/json/compsci-units.json').subscribe(data => {
      this.units = data;
      this.groupUnits();
    });
  }

  groupUnits() {
    const groupSize = 4;
    for (let i = 0; i < this.units.length; i += groupSize) {
      this.groupedUnits.push(this.units.slice(i, i + groupSize));
    }
  }
}
