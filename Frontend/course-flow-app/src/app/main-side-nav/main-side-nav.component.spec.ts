import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainSideNavComponent } from './main-side-nav.component';

/*describe('MainSideNavComponent', () => {
  let component: MainSideNavComponent;
  let fixture: ComponentFixture<MainSideNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainSideNavComponent]
    });
    fixture = TestBed.createComponent(MainSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/

describe('MainSideNavComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        MainSideNavComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MainSideNavComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /*it(`should have as title 'angular-responsive-sidebar'`, () => {
    const fixture = TestBed.createComponent(MainSideNavComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular-responsive-sidebar');
  });*/

  it('should render title', () => {
    const fixture = TestBed.createComponent(MainSideNavComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('angular-responsive-sidebar app is running!');
  });
});