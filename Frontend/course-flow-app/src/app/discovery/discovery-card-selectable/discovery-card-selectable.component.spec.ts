import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryCardSelectableComponent } from './discovery-card-selectable.component';

describe('DiscoveryCardSelectableComponent', () => {
  let component: DiscoveryCardSelectableComponent;
  let fixture: ComponentFixture<DiscoveryCardSelectableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryCardSelectableComponent]
    });
    fixture = TestBed.createComponent(DiscoveryCardSelectableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
