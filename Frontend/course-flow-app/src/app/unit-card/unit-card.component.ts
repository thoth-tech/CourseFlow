import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.css']
})
export class UnitCardComponent {
  @Input() unitCode!: string;
  @Input() unitName!: string;
  @Input() unitType!: string;
  // @Input() unitStatus!: string;


  @Output() infoClicked = new EventEmitter<void>();

  showInfo() {
    // Emit an event when the info icon is clicked
    this.infoClicked.emit();
  }
}
