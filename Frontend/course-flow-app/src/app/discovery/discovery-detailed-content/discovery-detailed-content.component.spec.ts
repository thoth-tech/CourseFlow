import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryDetailedContentComponent } from './discovery-detailed-content.component';

describe('DiscoveryDetailedContentComponent', () => {
  let component: DiscoveryDetailedContentComponent;
  let fixture: ComponentFixture<DiscoveryDetailedContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryDetailedContentComponent]
    });
    fixture = TestBed.createComponent(DiscoveryDetailedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
