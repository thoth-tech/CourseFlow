import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryConnectionSelectablesComponent } from './discovery-connection-selectables.component';

describe('DiscoveryConnectionSelectablesComponent', () => {
  let component: DiscoveryConnectionSelectablesComponent;
  let fixture: ComponentFixture<DiscoveryConnectionSelectablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryConnectionSelectablesComponent]
    });
    fixture = TestBed.createComponent(DiscoveryConnectionSelectablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
