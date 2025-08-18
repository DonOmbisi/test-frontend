import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-data-processing',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatIconModule,
        MatChipsModule
    ],
    template: `
    <div class="page-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <mat-icon class="hero-icon">transform</mat-icon>
            Data Processing
          </h1>
          <p class="hero-subtitle">
            Convert Excel files to CSV format with intelligent score processing and data transformation
          </p>
        </div>
        <div class="hero-visual">
          <div class="floating-card">
            <mat-icon>file_upload</mat-icon>
          </div>
        </div>
      </div>

      <!-- Main Processing Card -->
      <div class="processing-container">
        <mat-card class="main-card">
          <mat-card-header class="card-header">
            <div class="header-icon">
              <mat-icon>transform</mat-icon>
            </div>
            <mat-card-title>Process Excel Files</mat-card-title>
            <mat-card-subtitle>
              Upload and convert Excel files to CSV with enhanced processing
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content class="card-content">
            
            <!-- File Upload Section -->
            <div class="upload-section">
              <div class="upload-area" 
                   [class.drag-over]="isDragOver"
                   [class.has-file]="selectedFile"
                   (dragover)="onDragOver($event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onDrop($event)"
                   (click)="fileInput.click()">
                
                <input
                  #fileInput
                  type="file"
                  accept=".xlsx,.xls"
                  (change)="onFileSelected($event)"
                  style="display: none;">

                <div class="upload-content" *ngIf="!selectedFile">
                  <mat-icon class="upload-icon">cloud_upload</mat-icon>
                  <h3>Drop your Excel file here</h3>
                  <p>or click to browse</p>
                  <div class="file-types">
                    <mat-chip-set>
                      <mat-chip class="file-type-chip">.xlsx</mat-chip>
                      <mat-chip class="file-type-chip">.xls</mat-chip>
                    </mat-chip-set>
                  </div>
                </div>

                <div class="file-preview" *ngIf="selectedFile">
                  <div class="file-icon">
                    <mat-icon>description</mat-icon>
                  </div>
                  <div class="file-details">
                    <h4>{{ selectedFile.name }}</h4>
                    <p>{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                    <p class="file-type">{{ getFileType(selectedFile.name) }}</p>
                  </div>
                  <button mat-icon-button class="remove-file" (click)="removeFile()">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>

              <!-- Processing Options -->
              <div class="processing-options" *ngIf="selectedFile">
                <h4>Processing Options</h4>
                <div class="options-grid">
                  <div class="option-item">
                    <mat-icon class="option-icon">score</mat-icon>
                    <div class="option-content">
                      <h5>Score Enhancement</h5>
                      <p>Automatically add +10 to all student scores</p>
                    </div>
                  </div>
                  <div class="option-item">
                    <mat-icon class="option-icon">format_list_bulleted</mat-icon>
                    <div class="option-content">
                      <h5>CSV Conversion</h5>
                      <p>Convert to CSV format for better compatibility</p>
                    </div>
                  </div>
                  <div class="option-item">
                    <mat-icon class="option-icon">data_usage</mat-icon>
                    <div class="option-content">
                      <h5>Data Validation</h5>
                      <p>Validate and clean data during processing</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons" *ngIf="selectedFile">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="convertToCsv()"
                  [disabled]="isProcessing"
                  class="process-button">
                  <mat-icon>{{ isProcessing ? 'hourglass_empty' : 'play_arrow' }}</mat-icon>
                  {{ isProcessing ? 'Processing...' : 'Process File' }}
                </button>
                
                <button
                  mat-stroked-button
                  color="accent"
                  (click)="fileInput.click()"
                  [disabled]="isProcessing"
                  class="change-file-button">
                  <mat-icon>swap_horiz</mat-icon>
                  Change File
                </button>
              </div>
            </div>

            <!-- Progress Section -->
            <div class="progress-section" *ngIf="isProcessing">
              <div class="progress-header">
                <mat-icon class="progress-icon">sync</mat-icon>
                <span>Processing your file...</span>
              </div>
              <mat-progress-bar
                mode="indeterminate"
                class="progress-bar">
              </mat-progress-bar>
              <p class="progress-text">This may take a few moments depending on file size</p>
            </div>

            <!-- Results Section -->
            <div class="results-section" *ngIf="conversionResult">
              <div class="result-header">
                <mat-icon class="result-icon" [class.success]="conversionResult.success" [class.error]="!conversionResult.success">
                  {{ conversionResult.success ? 'check_circle' : 'error' }}
                </mat-icon>
                <h3>Processing {{ conversionResult.success ? 'Successful' : 'Failed' }}</h3>
              </div>
              
              <div class="result-content">
                <div class="result-item">
                  <span class="label">Status:</span>
                  <span class="value" [class.success]="conversionResult.success" [class.error]="!conversionResult.success">
                    {{ conversionResult.success ? 'Success' : 'Failed' }}
                  </span>
                </div>
                
                <div class="result-item">
                  <span class="label">Message:</span>
                  <span class="value">{{ conversionResult.message }}</span>
                </div>
                
                <div class="result-item" *ngIf="conversionResult.csvFilePath">
                  <span class="label">Output File:</span>
                  <span class="value file-path">{{ conversionResult.csvFilePath }}</span>
                </div>
              </div>

              <!-- Success Actions -->
              <div class="success-actions" *ngIf="conversionResult.success">
                <button mat-stroked-button color="primary" class="action-button">
                  <mat-icon>download</mat-icon>
                  Download CSV
                </button>
                <button mat-stroked-button color="accent" class="action-button">
                  <mat-icon>share</mat-icon>
                  Share Results
                </button>
                <button mat-stroked-button color="warn" class="action-button">
                  <mat-icon>delete</mat-icon>
                  Clear Results
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <h2 class="section-title">Why Choose Our Data Processor?</h2>
        <div class="features-grid">
          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon class="feature-icon">speed</mat-icon>
              <mat-card-title>Lightning Fast</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Process large Excel files in seconds with our optimized algorithms</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon class="feature-icon">security</mat-icon>
              <mat-card-title>Secure Processing</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Your data is processed locally and never stored on our servers</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon class="feature-icon">auto_fix_high</mat-icon>
              <mat-card-title>Smart Enhancement</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Automatically enhance scores and validate data integrity</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon class="feature-icon">format_list_bulleted</mat-icon>
              <mat-card-title>Multiple Formats</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Export to CSV, JSON, or keep original Excel format</p>
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

    /* Processing Container */
    .processing-container {
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

    /* Upload Section */
    .upload-section {
      max-width: 800px;
      margin: 0 auto;
    }

    .upload-area {
      border: 3px dashed #ddd;
      border-radius: 20px;
      padding: 48px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(248, 249, 250, 0.5);
      margin-bottom: 32px;
    }

    .upload-area:hover {
      border-color: var(--primary-color);
      background: rgba(102, 126, 234, 0.05);
      transform: translateY(-2px);
    }

    .upload-area.drag-over {
      border-color: var(--primary-color);
      background: rgba(102, 126, 234, 0.1);
      transform: scale(1.02);
    }

    .upload-area.has-file {
      border-color: var(--success-color);
      background: rgba(76, 175, 80, 0.05);
    }

    .upload-content {
      color: #666;
    }

    .upload-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #999;
      margin-bottom: 16px;
    }

    .upload-content h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 24px;
    }

    .upload-content p {
      margin: 0 0 24px 0;
      color: #666;
      font-size: 16px;
    }

    .file-types {
      margin-top: 24px;
    }

    .file-type-chip {
      background: rgba(102, 126, 234, 0.1) !important;
      color: var(--primary-color) !important;
      border: 1px solid rgba(102, 126, 234, 0.2) !important;
    }

    /* File Preview */
    .file-preview {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .file-icon {
      width: 48px;
      height: 48px;
      background: var(--primary-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .file-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .file-details {
      flex: 1;
      text-align: left;
    }

    .file-details h4 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 18px;
    }

    .file-details p {
      margin: 0 0 2px 0;
      color: #666;
      font-size: 14px;
    }

    .file-type {
      color: var(--primary-color) !important;
      font-weight: 600;
    }

    .remove-file {
      color: #999;
      transition: color 0.3s ease;
    }

    .remove-file:hover {
      color: var(--error-color);
    }

    /* Processing Options */
    .processing-options {
      margin: 32px 0;
      padding: 24px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 16px;
      border: 1px solid rgba(102, 126, 234, 0.1);
    }

    .processing-options h4 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 20px;
      text-align: center;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .option-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .option-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .option-icon {
      color: var(--primary-color);
      font-size: 24px;
      width: 24px;
      height: 24px;
      margin-top: 4px;
    }

    .option-content h5 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 16px;
    }

    .option-content p {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 32px 0;
    }

    .process-button {
      padding: 16px 48px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 50px;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    .process-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
    }

    .change-file-button {
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 50px;
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

    /* Features Section */
    .features-section {
      margin-top: 48px;
    }

    .section-title {
      text-align: center;
      color: white;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 32px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      text-align: center;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .feature-card mat-card-header {
      padding: 24px 24px 16px;
    }

    .feature-icon {
      color: var(--primary-color);
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin: 0 auto 16px;
    }

    .feature-card mat-card-title {
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .feature-card mat-card-content {
      padding: 0 24px 24px;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
      font-size: 14px;
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

      .upload-area {
        padding: 32px 24px;
      }

      .options-grid {
        grid-template-columns: 1fr;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DataProcessingComponent {
  selectedFile: File | null = null;
  isProcessing = false;
  conversionResult: any = null;
  isDragOver = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0 && files[0]) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    // Validate file type
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.selectedFile = file;
      this.conversionResult = null;
    } else {
      this.snackBar.open('Please select an Excel file (.xlsx or .xls)', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.conversionResult = null;
  }

  getFileType(filename: string): string {
    return filename.split('.').pop()?.toUpperCase() || '';
  }

  convertToCsv() {
    if (!this.selectedFile) {
      return;
    }

    this.isProcessing = true;
    this.conversionResult = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8081/api/data-processing/excel-to-csv', formData)
      .subscribe({
        next: (response: any) => {
          this.conversionResult = response;
          this.isProcessing = false;
          
          if (response.success) {
            this.snackBar.open('File processed successfully!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          } else {
            this.snackBar.open('Error processing file: ' + response.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.conversionResult = {
            success: false,
            message: 'Network error: ' + error.message
          };
          this.isProcessing = false;
          
          this.snackBar.open('Network error occurred', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
