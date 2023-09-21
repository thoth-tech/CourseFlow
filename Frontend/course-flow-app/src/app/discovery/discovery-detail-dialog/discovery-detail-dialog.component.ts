import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-discovery-detail-dialog',
  templateUrl: './discovery-detail-dialog.component.html',
  styleUrls: ['./discovery-detail-dialog.component.css'],
})
export class DiscoveryDetailDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {discoveryNodeData: string}) {}
}
