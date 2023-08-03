import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryPageComponent } from './discovery-page.component';

describe('DiscoveryPageComponent', () => {
  let component: DiscoveryPageComponent;
  let fixture: ComponentFixture<DiscoveryPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryPageComponent]
    });
    fixture = TestBed.createComponent(DiscoveryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
