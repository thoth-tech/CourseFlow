import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryDetailedSidePanelComponent } from './discovery-detailed-side-panel.component';

describe('DiscoveryDetailedSidePanelComponent', () => {
  let component: DiscoveryDetailedSidePanelComponent;
  let fixture: ComponentFixture<DiscoveryDetailedSidePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryDetailedSidePanelComponent]
    });
    fixture = TestBed.createComponent(DiscoveryDetailedSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
