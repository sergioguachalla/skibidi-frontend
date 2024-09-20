import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; 
import { IngresarLibroComponent } from './ingresar-libro.component';

describe('IngresarLibroComponent', () => {
  let component: IngresarLibroComponent;
  let fixture: ComponentFixture<IngresarLibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresarLibroComponent ],
      imports: [ FormsModule ] // Importamos FormsModule para el two-way data binding
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log the title when submitted', () => {
    spyOn(console, 'log');
    expect(console.log).toHaveBeenCalledWith('Buscando libro:', 'Test Book');
  });

  it('should show an error if title is empty', () => {
    spyOn(console, 'error');
    expect(console.error).toHaveBeenCalledWith('Por favor, ingrese un título.');
  });
});
