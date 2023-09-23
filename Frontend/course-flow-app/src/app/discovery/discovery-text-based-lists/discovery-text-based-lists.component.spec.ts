import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryTextBasedListsComponent } from './discovery-text-based-lists.component';

describe('DiscoveryTextBasedListsComponent', () => {
  let component: DiscoveryTextBasedListsComponent;
  let fixture: ComponentFixture<DiscoveryTextBasedListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryTextBasedListsComponent]
    });
    fixture = TestBed.createComponent(DiscoveryTextBasedListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
