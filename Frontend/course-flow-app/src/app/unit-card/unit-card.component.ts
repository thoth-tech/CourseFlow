import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UnitDetailDialogComponent } from '../unit-detail-dialog/unit-detail-dialog.component';


@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.css']
})

export class UnitCardComponent implements OnInit{

  @Input() unitCode!: string;
  @Input() unitName!: string;
  @Input() unitType!: string;
  @Input() unit: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openUnitPopup() {
    this.dialog.open(UnitDetailDialogComponent, {
      width: '1400px',
      data: this.unit
    });
  }
}
