import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-data-generation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatIconModule,
        MatSliderModule,
        MatChipsModule
    ],
    template: `
    <div class="page-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <mat-icon class="hero-icon">data_usage</mat-icon>
            Data Generation
          </h1>
          <p class="hero-subtitle">
            Generate comprehensive Excel files with realistic student data for testing and development
          </p>
        </div>
        <div class="hero-visual">
          <div class="floating-card">
            <mat-icon>table_chart</mat-icon>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="form-container">
        <mat-card class="main-card">
          <mat-card-header class="card-header">
            <div class="header-icon">
              <mat-icon>add_circle</mat-icon>
            </div>
            <mat-card-title>Generate Student Data</mat-card-title>
            <mat-card-subtitle>
              Configure your data generation parameters
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content class="card-content">
            <form [formGroup]="generationForm" (ngSubmit)="onSubmit()" class="generation-form">
              
              <!-- Number of Records Input -->
              <div class="form-section">
                <label class="section-label">
                  <mat-icon>numbers</mat-icon>
                  Number of Records
                </label>
                
                <div class="input-group">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Enter number of student records</mat-label>
                    <input
                      matInput
                      type="number"
                      formControlName="numberOfRecords"
                      placeholder="e.g., 1000"
                      min="1"
                      max="1000000">
                    <mat-icon matSuffix>person</mat-icon>
                  </mat-form-field>
                  
                  <!-- Quick Selection Chips -->
                  <div class="quick-selection">
                    <mat-chip-set>
                      <mat-chip 
                        *ngFor="let amount of quickAmounts" 
                        (click)="selectAmount(amount)"
                        [class.selected]="generationForm.get('numberOfRecords')?.value === amount"
                        class="amount-chip">
                        {{ amount.toLocaleString() }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                </div>

                <!-- Validation Messages -->
                <div class="validation-messages" *ngIf="generationForm.get('numberOfRecords')?.touched">
                  <div class="error-message" *ngIf="generationForm.get('numberOfRecords')?.hasError('required')">
                    <mat-icon>error</mat-icon>
                    Number of records is required
                  </div>
                  <div class="error-message" *ngIf="generationForm.get('numberOfRecords')?.hasError('min')">
                    <mat-icon>error</mat-icon>
                    Minimum 1 record required
                  </div>
                  <div class="error-message" *ngIf="generationForm.get('numberOfRecords')?.hasError('max')">
                    <mat-icon>error</mat-icon>
                    Maximum 1,000,000 records allowed
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="submit-section">
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="generationForm.invalid || isGenerating"
                  class="submit-button">
                  <mat-icon>{{ isGenerating ? 'hourglass_empty' : 'add_circle' }}</mat-icon>
                  {{ isGenerating ? 'Generating Data...' : 'Generate Data' }}
                </button>
                
                <button
                  mat-stroked-button
                  color="accent"
                  type="button"
                  (click)="runQuickPerformanceTest()"
                  [disabled]="isGenerating"
                  class="quick-performance-button">
                  <mat-icon>flash_on</mat-icon>
                  Quick Test
                </button>
              </div>
            </form>

            <!-- Progress Bar -->
            <div class="progress-section" *ngIf="isGenerating">
              <div class="progress-header">
                <mat-icon class="progress-icon">sync</mat-icon>
                <span>Generating student data...</span>
              </div>
              <mat-progress-bar
                mode="indeterminate"
                class="progress-bar">
              </mat-progress-bar>
              <p class="progress-text">This may take a few moments for large datasets</p>
            </div>

            <!-- Results Section -->
            <div class="results-section" *ngIf="generationResult">
              <div class="result-header">
                <mat-icon class="result-icon" [class.success]="generationResult.success" [class.error]="!generationResult.success">
                  {{ generationResult.success ? 'check_circle' : 'error' }}
                </mat-icon>
                <h3>Generation {{ generationResult.success ? 'Successful' : 'Failed' }}</h3>
              </div>
              
              <div class="result-content">
                <div class="result-item">
                  <span class="label">Status:</span>
                  <span class="value" [class.success]="generationResult.success" [class.error]="!generationResult.success">
                    {{ generationResult.success ? 'Success' : 'Failed' }}
                  </span>
                </div>
                
                <div class="result-item">
                  <span class="label">Message:</span>
                  <span class="value">{{ generationResult.message }}</span>
                </div>
                
                <div class="result-item" *ngIf="generationResult.filePath">
                  <span class="label">File Path:</span>
                  <span class="value file-path">{{ generationResult.filePath }}</span>
                </div>
                
                <div class="result-item" *ngIf="generationResult.recordsGenerated">
                  <span class="label">Records Generated:</span>
                  <span class="value highlight">{{ generationResult.recordsGenerated.toLocaleString() }}</span>
                </div>
              </div>

              <!-- Success Actions -->
              <div class="success-actions" *ngIf="generationResult.success">
                <button mat-stroked-button color="primary" class="action-button" (click)="downloadFile()">
                  <mat-icon>download</mat-icon>
                  Download File
                </button>
                <button mat-stroked-button color="accent" class="action-button" (click)="shareResults()">
                  <mat-icon>share</mat-icon>
                  Share Results
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Info Cards -->
      <div class="info-section">
        <div class="info-grid">
          <mat-card class="info-card">
            <mat-card-header>
              <mat-icon class="info-icon">speed</mat-icon>
              <mat-card-title>Fast Generation</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Generate thousands of records in seconds with our optimized algorithms</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card">
            <mat-card-header>
              <mat-icon class="info-icon">security</mat-icon>
              <mat-card-title>Realistic Data</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Data follows realistic patterns and distributions for authentic testing</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="info-card">
            <mat-card-header>
              <mat-icon class="info-icon">format_list_bulleted</mat-icon>
              <mat-card-title>Multiple Formats</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Export to Excel, CSV, or JSON formats for maximum compatibility</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      min-height: 100vh;
      padding: 0;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 48px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .hero-content {
      flex: 1;
      z-index: 1;
    }

    .hero-title {
      color: white;
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 16px;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .hero-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ff6b6b;
    }

    .hero-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 20px;
      margin: 0;
      line-height: 1.6;
      max-width: 600px;
    }

    .hero-visual {
      position: relative;
      z-index: 1;
    }

    .floating-card {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      animation: float 4s ease-in-out infinite;
    }

    .floating-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: white;
    }

    /* Form Container */
    .form-container {
      margin-bottom: 48px;
    }

    .main-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      text-align: center;
    }

    .header-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .header-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .card-header mat-card-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .card-header mat-card-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }

    .card-content {
      padding: 48px;
    }

    /* Form Styling */
    .generation-form {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .section-label mat-icon {
      color: #667eea;
    }

    .input-group {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .quick-selection {
      margin-top: 16px;
    }

    .amount-chip {
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 4px;
    }

    .amount-chip:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .amount-chip.selected {
      background: #667eea !important;
      color: white !important;
    }

    /* Validation Messages */
    .validation-messages {
      margin-top: 8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      font-size: 14px;
      margin: 4px 0;
    }

    .error-message mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Submit Section */
    .submit-section {
      text-align: center;
      margin: 32px 0;
    }

    .submit-button {
      padding: 16px 48px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 50px;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
    }

    .quick-performance-button {
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 50px;
      margin-left: 16px;
      transition: all 0.3s ease;
    }

    .quick-performance-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .submit-button mat-icon {
      margin-right: 8px;
    }

    /* Progress Section */
    .progress-section {
      background: rgba(102, 126, 234, 0.1);
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }

    .progress-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
      color: #667eea;
      font-weight: 600;
    }

    .progress-icon {
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .progress-bar {
      height: 8px;
      border-radius: 4px;
    }

    .progress-text {
      color: #666;
      margin: 16px 0 0 0;
      font-size: 14px;
    }

    /* Results Section */
    .results-section {
      background: rgba(76, 175, 80, 0.1);
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
      border-left: 4px solid #4caf50;
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .result-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .result-icon.success {
      color: #4caf50;
    }

    .result-icon.error {
      color: #f44336;
    }

    .result-header h3 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .result-content {
      margin-bottom: 20px;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .result-item:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .value.success {
      color: #4caf50;
    }

    .value.error {
      color: #f44336;
    }

    .value.highlight {
      color: #667eea;
      font-weight: 700;
    }

    .file-path {
      font-family: 'Courier New', monospace;
      background: rgba(0, 0, 0, 0.05);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    /* Success Actions */
    .success-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .action-button {
      border-radius: 25px;
      padding: 8px 24px;
      transition: all 0.3s ease;
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Info Section */
    .info-section {
      margin-top: 48px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .info-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .info-card mat-card-header {
      padding: 24px 24px 16px;
    }

    .info-icon {
      color: #667eea;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .info-card mat-card-title {
      color: #333;
      font-size: 20px;
      font-weight: 600;
    }

    .info-card mat-card-content {
      padding: 0 24px 24px;
    }

    .info-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 32px 24px;
      }

      .hero-title {
        font-size: 32px;
      }

      .hero-subtitle {
        font-size: 16px;
      }

      .floating-card {
        width: 80px;
        height: 80px;
        margin-top: 24px;
      }

      .floating-card mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      .card-content {
        padding: 24px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DataGenerationComponent {
  generationForm: FormGroup;
  isGenerating = false;
  generationResult: any = null;
  quickAmounts = [100, 500, 1000, 5000, 10000];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.generationForm = this.fb.group({
      numberOfRecords: [1000, [Validators.required, Validators.min(1), Validators.max(1000000)]]
    });
  }

  selectAmount(amount: number) {
    this.generationForm.patchValue({ numberOfRecords: amount });
  }

  onSubmit() {
    if (this.generationForm.valid) {
      this.generateData();
    }
  }

  generateData() {
    this.isGenerating = true;
    this.generationResult = null;

    const request = {
      numberOfRecords: this.generationForm.value.numberOfRecords
    };

    this.http.post('http://localhost:8081/api/data-generation/generate-excel', request)
      .subscribe({
        next: (response: any) => {
          this.generationResult = response;
          this.isGenerating = false;
          
          if (response.success) {
            this.snackBar.open('Data generated successfully!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          } else {
            this.snackBar.open('Error generating data: ' + response.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error: any) => {
          this.generationResult = {
            success: false,
            message: 'Network error: ' + error.message
          };
          this.isGenerating = false;
          
          this.snackBar.open('Network error occurred', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  runQuickPerformanceTest() {
    this.isGenerating = true;
    this.generationResult = null;

    this.http.post('http://localhost:8081/api/data-generation/quick-performance-test', {})
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.generationResult = {
              success: true,
              message: 'Quick performance test completed successfully',
              performanceResults: response
            };
            
            this.snackBar.open('Quick performance test completed!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          } else {
            this.generationResult = {
              success: false,
              message: 'Quick performance test failed: ' + response.message
            };
          }
          this.isGenerating = false;
        },
        error: (error: any) => {
          this.generationResult = {
            success: false,
            message: 'Error running quick performance test: ' + error.message
          };
          this.isGenerating = false;
          
          this.snackBar.open('Error running quick performance test', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  downloadFile() {
    if (this.generationResult && this.generationResult.filePath) {
      const filePath = this.generationResult.filePath;
      // Extract just the filename from the path, handling both Windows and Unix paths
      let fileName = filePath;
      if (filePath.includes('/')) {
        fileName = filePath.split('/').pop() || 'data.xlsx';
      } else if (filePath.includes('\\')) {
        fileName = filePath.split('\\').pop() || 'data.xlsx';
      }
      
      this.http.get(`http://localhost:8081/api/data-generation/download/${encodeURIComponent(fileName)}`, { responseType: 'blob' })
        .subscribe({
          next: (response: Blob) => {
            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.snackBar.open(`File "${fileName}" downloaded successfully!`, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.snackBar.open('Error downloading file: ' + error.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
    } else if (this.generationResult && this.generationResult.performanceResults) {
      // Handle quick performance test results - show available files
      const performanceResults = this.generationResult.performanceResults;
      const availableFiles = [];
      
      for (const key in performanceResults) {
        if (key.startsWith('test_') && performanceResults[key].filePath) {
          const testSize = key.replace('test_', '');
          const filePath = performanceResults[key].filePath;
          let fileName = filePath;
          if (filePath.includes('/')) {
            fileName = filePath.split('/').pop() || 'data.xlsx';
          } else if (filePath.includes('\\')) {
            fileName = filePath.split('\\').pop() || 'data.xlsx';
          }
          availableFiles.push({ size: testSize, fileName: fileName, filePath: performanceResults[key].filePath });
        }
      }
      
      if (availableFiles.length > 0) {
        // Download the largest file (last one)
        const largestFile = availableFiles[availableFiles.length - 1];
        if (largestFile) {
          const fileName = largestFile.fileName;
          
          this.http.get(`http://localhost:8081/api/data-generation/download/${encodeURIComponent(fileName)}`, { responseType: 'blob' })
            .subscribe({
              next: (response: Blob) => {
                const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.snackBar.open(`File "${fileName}" (${largestFile.size} records) downloaded successfully!`, 'Close', {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass: ['success-snackbar']
                });
              },
              error: (error) => {
                this.snackBar.open('Error downloading file: ' + error.message, 'Close', {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass: ['error-snackbar']
                });
              }
            });
        }
      } else {
        this.snackBar.open('No files available to download from performance test.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['info-snackbar']
        });
      }
    } else {
      this.snackBar.open('No file path available to download.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['info-snackbar']
      });
    }
  }

  shareResults() {
    if (this.generationResult && this.generationResult.filePath) {
      const filePath = this.generationResult.filePath;
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'data.xlsx';
      const url = `${window.location.origin}/api/data-generation/download/${encodeURIComponent(fileName)}`;

      const shareData = {
        title: 'Generated Student Data',
        text: `Check out the generated student data file: ${fileName}`,
        url: url
      };

      if (navigator.share) {
        navigator.share(shareData)
          .then(() => {
            this.snackBar.open('Data shared successfully!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          })
          .catch((error) => {
            this.snackBar.open('Error sharing data: ' + error.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          });
      } else {
        this.snackBar.open('Web Share API not supported in your browser.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['info-snackbar']
        });
      }
    } else if (this.generationResult && this.generationResult.performanceResults) {
      // Handle quick performance test results - show available files
      const performanceResults = this.generationResult.performanceResults;
      const availableFiles = [];
      
      for (const key in performanceResults) {
        if (key.startsWith('test_') && performanceResults[key].filePath) {
          const testSize = key.replace('test_', '');
          const filePath = performanceResults[key].filePath;
          let fileName = filePath;
          if (filePath.includes('/')) {
            fileName = filePath.split('/').pop() || 'data.xlsx';
          } else if (filePath.includes('\\')) {
            fileName = filePath.split('\\').pop() || 'data.xlsx';
          }
          availableFiles.push({ size: testSize, fileName: fileName, filePath: performanceResults[key].filePath });
        }
      }
      
      if (availableFiles.length > 0) {
        const largestFile = availableFiles[availableFiles.length - 1];
        if (largestFile) {
          const fileName = largestFile.fileName;
          const url = `${window.location.origin}/api/data-generation/download/${encodeURIComponent(fileName)}`;

          const shareData = {
            title: 'Generated Student Data',
            text: `Check out the generated student data file (${largestFile.size} records): ${fileName}`,
            url: url
          };

          if (navigator.share) {
            navigator.share(shareData)
              .then(() => {
                this.snackBar.open('Data shared successfully!', 'Close', {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass: ['success-snackbar']
                });
              })
              .catch((error) => {
                this.snackBar.open('Error sharing data: ' + error.message, 'Close', {
                  duration: 5000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass: ['error-snackbar']
                });
              });
          } else {
            this.snackBar.open('Web Share API not supported in your browser.', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['info-snackbar']
            });
          }
        }
      } else {
        this.snackBar.open('No files available to share from performance test.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['info-snackbar']
        });
      }
    } else {
      this.snackBar.open('No file path available to share.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['info-snackbar']
      });
    }
  }
}
