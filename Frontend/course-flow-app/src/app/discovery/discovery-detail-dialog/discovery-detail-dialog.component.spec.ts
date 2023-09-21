import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoveryDetailDialogComponent } from './discovery-detail-dialog.component';


describe('DiscoveryDetailDialogComponent', () => {
  let component: DiscoveryDetailDialogComponent;
  let fixture: ComponentFixture<DiscoveryDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryDetailDialogComponent]
    });
    fixture = TestBed.createComponent(DiscoveryDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
