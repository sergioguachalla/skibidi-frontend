import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBooksComponent } from './view-books.component';
import { FormsModule } from '@angular/forms';

describe('ViewBooksComponent', () => {
  let component: ViewBooksComponent;
  let fixture: ComponentFixture<ViewBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBooksComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter books based on search query', () => {
    component.onSearch();
    expect(component.librosFiltrados.length).toBe(1);
  });
});
