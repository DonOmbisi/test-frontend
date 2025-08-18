import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DataGenerationComponent } from './data-generation.component';

describe('DataGenerationComponent', () => {
  let component: DataGenerationComponent;
  let fixture: ComponentFixture<DataGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataGenerationComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form values', () => {
    expect(component.generationForm.get('numberOfRecords')?.value).toBe(1000);
  });

  it('should have quick amounts array', () => {
    expect(component.quickAmounts).toEqual([100, 500, 1000, 5000, 10000]);
  });
});
