import { Component, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  dob: string;
  className: string;
  score: number;
}

interface ReportRequest {
  page: number;
  size: number;
  studentId?: number | undefined;
  className?: string | undefined;
}

@Component({
    selector: 'app-reports',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule
],
    template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Reports Module</mat-card-title>
          <mat-card-subtitle>View, filter, and export student data</mat-card-subtitle>
        </mat-card-header>
    
        <mat-card-content>
          <!-- Filters -->
          <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="filter-section">
            <div class="filter-row">
              <mat-form-field appearance="outline">
                <mat-label>Student ID</mat-label>
                <input matInput formControlName="studentId" placeholder="Search by Student ID" type="number" min="1">
                <mat-error *ngIf="filterForm.get('studentId')?.errors?.['invalidStudentId']">
                  Please enter a valid Student ID (positive number)
                </mat-error>
              </mat-form-field>
    
              <mat-form-field appearance="outline">
                <mat-label>Class</mat-label>
                <mat-select formControlName="className">
                  <mat-option value="">All Classes</mat-option>
                  <mat-option value="Class1">Class1</mat-option>
                  <mat-option value="Class2">Class2</mat-option>
                  <mat-option value="Class3">Class3</mat-option>
                  <mat-option value="Class4">Class4</mat-option>
                  <mat-option value="Class5">Class5</mat-option>
                </mat-select>
              </mat-form-field>
    
              <button mat-raised-button color="primary" type="submit">
                <mat-icon>search</mat-icon>
                Apply Filters
              </button>
            </div>
          </form>
    
          <!-- Export Buttons -->
          <div class="export-section">
            <h3>Export Options</h3>
            <div class="export-buttons">
              <button
                mat-raised-button
                color="accent"
                (click)="exportToExcel()"
                [disabled]="isExporting">
                <mat-icon>table_chart</mat-icon>
                Export to Excel
              </button>
    
              <button
                mat-raised-button
                color="accent"
                (click)="exportToCsv()"
                [disabled]="isExporting">
                <mat-icon>description</mat-icon>
                Export to CSV
              </button>
    
              <button
                mat-raised-button
                color="accent"
                (click)="exportToPdf()"
                [disabled]="isExporting">
                <mat-icon>picture_as_pdf</mat-icon>
                Export to PDF
              </button>
            </div>
          </div>
    
          <!-- Progress Bar -->
          @if (isLoading || isExporting) {
            <mat-progress-bar
              mode="indeterminate"
              class="progress-bar">
            </mat-progress-bar>
          }
    
          <!-- Results Summary -->
          @if (totalElements > 0) {
            <div class="results-summary">
              <p>
                Showing {{ (currentPage * pageSize) + 1 }} -
                {{ Math.min((currentPage + 1) * pageSize, totalElements) }}
                of {{ totalElements.toLocaleString() }} students
              </p>
            </div>
          }
    
          <!-- Data Table -->
          @if (students.length > 0) {
            <div class="table-container">
              <table mat-table [dataSource]="students" class="student-table">
                <!-- Student ID Column -->
                <ng-container matColumnDef="studentId">
                  <th mat-header-cell *matHeaderCellDef>Student ID</th>
                  <td mat-cell *matCellDef="let student">{{ student.studentId }}</td>
                </ng-container>
                <!-- First Name Column -->
                <ng-container matColumnDef="firstName">
                  <th mat-header-cell *matHeaderCellDef>First Name</th>
                  <td mat-cell *matCellDef="let student">{{ student.firstName }}</td>
                </ng-container>
                <!-- Last Name Column -->
                <ng-container matColumnDef="lastName">
                  <th mat-header-cell *matHeaderCellDef>Last Name</th>
                  <td mat-cell *matCellDef="let student">{{ student.lastName }}</td>
                </ng-container>
                <!-- DOB Column -->
                <ng-container matColumnDef="dob">
                  <th mat-header-cell *matHeaderCellDef>Date of Birth</th>
                  <td mat-cell *matCellDef="let student">{{ student.dob }}</td>
                </ng-container>
                <!-- Class Column -->
                <ng-container matColumnDef="className">
                  <th mat-header-cell *matHeaderCellDef>Class</th>
                  <td mat-cell *matCellDef="let student">{{ student.className }}</td>
                </ng-container>
                <!-- Score Column -->
                <ng-container matColumnDef="score">
                  <th mat-header-cell *matHeaderCellDef>Score</th>
                  <td mat-cell *matCellDef="let student">{{ student.score }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
              <!-- Pagination -->
              <mat-paginator
                [length]="totalElements"
                [pageSize]="pageSize"
                [pageSizeOptions]="[10, 20, 50, 100]"
                [pageIndex]="currentPage"
                (page)="onPageChange($event)"
                showFirstLastButtons>
              </mat-paginator>
            </div>
          }
    
          <!-- No Data Message -->
          @if (!isLoading && students.length === 0) {
            <div class="no-data">
              <p>No students found matching the current filters.</p>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
    `,
    styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .filter-section {
      margin-bottom: 24px;
    }
    
    .filter-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .filter-row mat-form-field {
      min-width: 200px;
    }
    
    .export-section {
      margin: 24px 0;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .export-section h3 {
      margin-top: 0;
      color: #333;
    }
    
    .export-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .progress-bar {
      margin: 16px 0;
    }
    
    .results-summary {
      margin: 16px 0;
      text-align: center;
      font-weight: 500;
    }
    
    .table-container {
      margin-top: 24px;
      overflow-x: auto;
    }
    
    .student-table {
      width: 100%;
    }
    
    .student-table th,
    .student-table td {
      padding: 12px 8px;
    }
    
    .no-data {
      text-align: center;
      padding: 48px;
      color: #666;
    }
    
    mat-card {
      margin-bottom: 24px;
    }
    
    @media (max-width: 768px) {
      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-row mat-form-field {
        min-width: auto;
      }
      
      .export-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  filterForm: FormGroup;
  students: Student[] = [];
  displayedColumns: string[] = ['studentId', 'firstName', 'lastName', 'dob', 'className', 'score'];
  
  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  
  // Loading states
  isLoading = false;
  isExporting = false;
  
  // Math for template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      studentId: ['', [this.validateStudentId.bind(this)]],
      className: ['']
    });
  }

  // Custom validator for studentId
  private validateStudentId(control: any) {
    const value = control.value;
    if (!value) return null; // Allow empty values
    
    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      return { invalidStudentId: true };
    }
    return null;
  }

  ngOnInit() {
    this.loadStudents();
  }

  applyFilters() {
    if (this.filterForm.invalid) {
      this.snackBar.open('Please fix the form errors before applying filters', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    this.currentPage = 0;
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    
    // Only add studentId if it's a valid number
    const studentIdValue = this.filterForm.value.studentId;
    const studentId = studentIdValue && !isNaN(Number(studentIdValue)) ? Number(studentIdValue) : undefined;
    
    const request: ReportRequest = {
      page: this.currentPage,
      size: this.pageSize,
      studentId: studentId,
      className: this.filterForm.value.className || undefined
    };

    const params = new URLSearchParams();
    params.set('page', request.page.toString());
    params.set('size', request.size.toString());
    if (request.studentId !== undefined) params.set('studentId', request.studentId.toString());
    if (request.className) params.set('className', request.className);

    this.http.get(`http://localhost:8081/api/reports/students?${params.toString()}`)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.students = response.students;
            this.totalElements = response.totalElements;
            this.currentPage = response.currentPage;
            this.pageSize = response.pageSize;
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.snackBar.open('Error loading students: ' + (error.message || 'Unknown error'), 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  exportToExcel() {
    if (this.filterForm.invalid) {
      this.snackBar.open('Please fix the form errors before exporting', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.exportData('excel');
  }

  exportToCsv() {
    if (this.filterForm.invalid) {
      this.snackBar.open('Please fix the form errors before exporting', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.exportData('csv');
  }

  exportToPdf() {
    if (this.filterForm.invalid) {
      this.snackBar.open('Please fix the form errors before exporting', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.exportData('pdf');
  }

  private exportData(format: string) {
    this.isExporting = true;
    
    // Only add studentId if it's a valid number
    const studentIdValue = this.filterForm.value.studentId;
    const studentId = studentIdValue && !isNaN(Number(studentIdValue)) ? Number(studentIdValue) : undefined;
    
    const request: ReportRequest = {
      page: this.currentPage,
      size: this.pageSize,
      studentId: studentId,
      className: this.filterForm.value.className || undefined
    };

    this.http.post(`http://localhost:8081/api/reports/export/${format}`, request)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            // Download the generated file
            this.downloadFile(response.filePath, format);
            this.snackBar.open(`${format.toUpperCase()} report generated successfully!`, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          } else {
            this.snackBar.open(`Error generating ${format.toUpperCase()} report: ` + response.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
          this.isExporting = false;
        },
        error: (error: any) => {
          this.snackBar.open(`Error generating ${format.toUpperCase()} report: ${error.message || 'Unknown error'}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
          this.isExporting = false;
        }
      });
  }

  private downloadFile(filePath: string, format: string) {
    const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || `report.${format}`;
    
    this.http.get(`http://localhost:8081/api/reports/download/${encodeURIComponent(fileName)}`, { responseType: 'blob' })
      .subscribe({
        next: (response: Blob) => {
          let mimeType = 'application/octet-stream';
          let fileExtension = format;
          
          switch (format) {
            case 'excel':
              mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
              fileExtension = 'xlsx';
              break;
            case 'csv':
              mimeType = 'text/csv';
              fileExtension = 'csv';
              break;
            case 'pdf':
              mimeType = 'application/pdf';
              fileExtension = 'pdf';
              break;
          }
          
          const blob = new Blob([response], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName.endsWith(`.${fileExtension}`) ? fileName : `${fileName}.${fileExtension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.snackBar.open(`Error downloading ${format.toUpperCase()} file: ${error.message}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
