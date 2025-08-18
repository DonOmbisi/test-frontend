import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-database',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatIconModule,
        MatChipsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule
    ],
    template: `
    <div class="page-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <mat-icon class="hero-icon">storage</mat-icon>
            Database Management
          </h1>
          <p class="hero-subtitle">
            Upload CSV files to the database and manage student records with real-time monitoring
          </p>
        </div>
        <div class="hero-visual">
          <div class="floating-card">
            <mat-icon>database</mat-icon>
          </div>
        </div>
      </div>

      <!-- Main Database Card -->
      <div class="database-container">
        <mat-card class="main-card">
          <mat-card-header class="card-header">
            <div class="header-icon">
              <mat-icon>upload_file</mat-icon>
            </div>
            <mat-card-title>Upload CSV to Database</mat-card-title>
            <mat-card-subtitle>
              Upload processed CSV files to the PostgreSQL database
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
                  accept=".csv"
                  (change)="onFileSelected($event)"
                  style="display: none;">

                <div class="upload-content" *ngIf="!selectedFile">
                  <mat-icon class="upload-icon">cloud_upload</mat-icon>
                  <h3>Drop your CSV file here</h3>
                  <p>or click to browse</p>
                  <div class="file-types">
                    <mat-chip-set>
                      <mat-chip class="file-type-chip">.csv</mat-chip>
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
                    <p class="file-type">CSV</p>
                  </div>
                  <button mat-icon-button class="remove-file" (click)="removeFile()">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>

              <!-- Upload Options -->
              <div class="upload-options" *ngIf="selectedFile">
                <h4>Upload Options</h4>
                <div class="options-grid">
                  <div class="option-item">
                    <mat-icon class="option-icon">score</mat-icon>
                    <div class="option-content">
                      <h5>Score Enhancement</h5>
                      <p>Automatically add +5 to all student scores</p>
                    </div>
                  </div>
                  <div class="option-item">
                    <mat-icon class="option-icon">batch</mat-icon>
                    <div class="option-content">
                      <h5>Batch Processing</h5>
                      <p>Process records in batches of 1000 for optimal performance</p>
                    </div>
                  </div>
                  <div class="option-item">
                    <mat-icon class="option-icon">validation</mat-icon>
                    <div class="option-content">
                      <h5>Data Validation</h5>
                      <p>Validate and clean data during upload</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons" *ngIf="selectedFile">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="uploadToDatabase()"
                  [disabled]="isUploading"
                  class="upload-button">
                  <mat-icon>{{ isUploading ? 'hourglass_empty' : 'cloud_upload' }}</mat-icon>
                  {{ isUploading ? 'Uploading...' : 'Upload to Database' }}
                </button>
                
                <button
                  mat-stroked-button
                  color="accent"
                  (click)="fileInput.click()"
                  [disabled]="isUploading"
                  class="change-file-button">
                  <mat-icon>swap_horiz</mat-icon>
                  Change File
                </button>
              </div>
            </div>

            <!-- Progress Section -->
            <div class="progress-section" *ngIf="isUploading">
              <div class="progress-header">
                <mat-icon class="progress-icon">sync</mat-icon>
                <span>Uploading to database...</span>
              </div>
              
              <!-- Progress Bar -->
              <mat-progress-bar
                [value]="uploadProgress"
                class="progress-bar">
              </mat-progress-bar>
              
              <div class="progress-details">
                <p class="progress-text">{{ uploadProgress }}% Complete</p>
                <p class="progress-info" *ngIf="uploadedRecords > 0">
                  {{ uploadedRecords.toLocaleString() }} records uploaded
                </p>
              </div>
            </div>

            <!-- Results Section -->
            <div class="results-section" *ngIf="uploadResult">
              <div class="result-header">
                <mat-icon class="result-icon" [class.success]="uploadResult.success" [class.error]="!uploadResult.success">
                  {{ uploadResult.success ? 'check_circle' : 'error' }}
                </mat-icon>
                <h3>Upload {{ uploadResult.success ? 'Successful' : 'Failed' }}</h3>
              </div>
              
              <div class="result-content">
                <div class="result-item">
                  <span class="label">Status:</span>
                  <span class="value" [class.success]="uploadResult.success" [class.error]="!uploadResult.success">
                    {{ uploadResult.success ? 'Success' : 'Failed' }}
                  </span>
                </div>
                
                <div class="result-item">
                  <span class="label">Message:</span>
                  <span class="value">{{ uploadResult.message }}</span>
                </div>
                
                <div class="result-item" *ngIf="uploadResult.recordsUploaded">
                  <span class="label">Records Uploaded:</span>
                  <span class="value highlight">{{ uploadResult.recordsUploaded.toLocaleString() }}</span>
                </div>
              </div>

              <!-- Success Actions -->
              <div class="success-actions" *ngIf="uploadResult.success">
                <button mat-stroked-button color="primary" class="action-button" (click)="loadStudents()">
                  <mat-icon>visibility</mat-icon>
                  View Records
                </button>
                <button mat-stroked-button color="accent" class="action-button">
                  <mat-icon>download</mat-icon>
                  Export Data
                </button>
                <button mat-stroked-button color="warn" class="action-button" (click)="clearResults()">
                  <mat-icon>delete</mat-icon>
                  Clear Results
                </button>
              </div>
            </div>

            <!-- Database Stats -->
            <div class="stats-section">
              <h4>Database Statistics</h4>
              <div class="stats-grid">
                <div class="stat-card">
                  <mat-icon class="stat-icon">people</mat-icon>
                  <div class="stat-content">
                    <h5>Total Students</h5>
                    <p class="stat-value">{{ totalStudents.toLocaleString() }}</p>
                  </div>
                </div>
                
                <div class="stat-card">
                  <mat-icon class="stat-icon">trending_up</mat-icon>
                  <div class="stat-content">
                    <h5>Average Score</h5>
                    <p class="stat-value">{{ averageScore.toFixed(1) }}</p>
                  </div>
                </div>
                
                <div class="stat-card">
                  <mat-icon class="stat-icon">class</mat-icon>
                  <div class="stat-content">
                    <h5>Total Classes</h5>
                    <p class="stat-value">{{ totalClasses }}</p>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Data Viewing Section -->
      <div class="data-viewing-container" *ngIf="students.length > 0">
        <mat-card class="data-card">
          <mat-card-header class="data-header">
            <div class="header-icon">
              <mat-icon>table_chart</mat-icon>
            </div>
            <mat-card-title>Student Records in Database</mat-card-title>
            <mat-card-subtitle>
              View and search through uploaded student data
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content class="data-content">
            <!-- Search and Filter Controls -->
            <div class="controls-section">
              <div class="search-controls">
                <mat-form-field class="search-field">
                  <mat-label>Search Students</mat-label>
                  <input matInput [(ngModel)]="searchTerm" placeholder="Search by name, ID, or class...">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>

                <mat-form-field class="filter-field">
                  <mat-label>Filter by Class</mat-label>
                  <mat-select [(ngModel)]="selectedClass">
                    <mat-option value="">All Classes</mat-option>
                    <mat-option *ngFor="let class of uniqueClasses" [value]="class">
                      {{ class }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <button mat-stroked-button color="primary" (click)="loadStudents()">
                  <mat-icon>refresh</mat-icon>
                  Refresh Data
                </button>
              </div>
            </div>

            <!-- Data Table -->
            <div class="table-container">
              <table mat-table [dataSource]="filteredStudents" class="data-table">
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

                <!-- Date of Birth Column -->
                <ng-container matColumnDef="dob">
                  <th mat-header-cell *matHeaderCellDef>Date of Birth</th>
                  <td mat-cell *matCellDef="let student">{{ student.dob | date:'shortDate' }}</td>
                </ng-container>

                <!-- Class Column -->
                <ng-container matColumnDef="className">
                  <th mat-header-cell *matHeaderCellDef>Class</th>
                  <td mat-cell *matCellDef="let student">{{ student.className }}</td>
                </ng-container>

                <!-- Score Column -->
                <ng-container matColumnDef="score">
                  <th mat-header-cell *matHeaderCellDef>Score</th>
                  <td mat-cell *matCellDef="let student" [class.high-score]="student.score >= 90">
                    {{ student.score }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <!-- Pagination -->
              <mat-paginator 
                [length]="filteredStudents.length"
                [pageSize]="10"
                [pageSizeOptions]="[5, 10, 25, 50]"
                showFirstLastButtons>
              </mat-paginator>
            </div>

            <!-- Data Summary -->
            <div class="data-summary">
              <div class="summary-item">
                <span class="label">Showing:</span>
                <span class="value">{{ filteredStudents.length }} of {{ students.length }} records</span>
              </div>
              <div class="summary-item">
                <span class="label">Last Updated:</span>
                <span class="value">{{ lastUpdated | date:'medium' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
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

    /* Database Container */
    .database-container {
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

    /* Upload Options */
    .upload-options {
      margin: 32px 0;
      padding: 24px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 16px;
      border: 1px solid rgba(102, 126, 234, 0.1);
    }

    .upload-options h4 {
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

    .upload-button {
      padding: 16px 48px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 50px;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    .upload-button:hover:not(:disabled) {
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
      margin-bottom: 16px;
    }

    .progress-details {
      margin-top: 16px;
    }

    .progress-text {
      color: #667eea;
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .progress-info {
      color: #666;
      margin: 0;
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

    /* Stats Section */
    .stats-section {
      margin-top: 48px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .stats-section h4 {
      margin: 0 0 24px 0;
      color: #333;
      font-size: 24px;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      color: var(--primary-color);
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stat-content h5 {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-value {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: 700;
    }

    /* Data Viewing Section */
    .data-viewing-container {
      margin-bottom: 48px;
    }

    .data-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
    }

    .data-header {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: white;
      padding: 32px;
      text-align: center;
    }

    .data-content {
      padding: 48px;
    }

    /* Controls Section */
    .controls-section {
      margin-bottom: 32px;
    }

    .search-controls {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      min-width: 300px;
    }

    .filter-field {
      min-width: 200px;
    }

    /* Table Container */
    .table-container {
      margin-bottom: 24px;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .data-table th {
      background: var(--primary-color);
      color: white;
      font-weight: 600;
      padding: 16px 12px;
    }

    .data-table td {
      padding: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .data-table tr:hover {
      background: rgba(102, 126, 234, 0.05);
    }

    .high-score {
      color: #4caf50;
      font-weight: 600;
    }

    /* Data Summary */
    .data-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .summary-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .summary-item .label {
      color: #666;
      font-weight: 500;
    }

    .summary-item .value {
      color: #333;
      font-weight: 600;
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

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .search-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field,
      .filter-field {
        min-width: auto;
      }

      .data-summary {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    }
  `]
})
export class DatabaseComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadResult: any = null;
  isDragOver = false;
  uploadProgress = 0;
  uploadedRecords = 0;
  totalStudents = 0;
  averageScore = 0;
  totalClasses = 0;
  
  // Data viewing properties
  students: any[] = [];
  filteredStudents: any[] = [];
  searchTerm = '';
  selectedClass = '';
  uniqueClasses: string[] = [];
  displayedColumns = ['studentId', 'firstName', 'lastName', 'dob', 'className', 'score'];
  lastUpdated = new Date();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.loadDatabaseStats();
  }

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
    if (file.name.endsWith('.csv')) {
      this.selectedFile = file;
      this.uploadResult = null;
    } else {
      this.snackBar.open('Please select a CSV file (.csv)', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.uploadResult = null;
  }

  uploadToDatabase() {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadResult = null;
    this.uploadProgress = 0;
    this.uploadedRecords = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8081/api/database/upload-csv', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Calculate upload progress
          if (event.total) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          }
        } else if (event.type === HttpEventType.Response) {
          // Upload completed
          this.uploadResult = event.body;
          this.isUploading = false;
          
          if (event.body?.success) {
            this.uploadedRecords = event.body.recordsUploaded || 0;
            this.snackBar.open('File uploaded successfully!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
            this.loadDatabaseStats(); // Refresh stats
            this.loadStudents(); // Load the new data
          } else {
            this.snackBar.open('Error uploading file: ' + event.body?.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        }
      },
      error: (error) => {
        this.uploadResult = {
          success: false,
          message: 'Network error: ' + error.message
        };
        this.isUploading = false;
        
        this.snackBar.open('Network error occurred', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadDatabaseStats() {
    this.http.get('http://localhost:8081/api/database/total-count').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.totalStudents = response.totalCount || 0;
        }
      },
      error: (error) => {
        console.error('Error loading database stats:', error);
      }
    });
  }

  loadStudents() {
    this.http.get('http://localhost:8081/api/database/students').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.students = response.students || [];
          this.filteredStudents = [...this.students];
          this.updateUniqueClasses();
          this.lastUpdated = new Date();
        }
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.snackBar.open('Error loading student data', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateUniqueClasses() {
    this.uniqueClasses = Array.from(new Set(this.students.map(s => s.className))).sort();
  }

  clearResults() {
    this.uploadResult = null;
    this.selectedFile = null;
  }

  // Filter students based on search term and class selection
  filterStudents() {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = !this.searchTerm || 
        student.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.studentId.toString().includes(this.searchTerm) ||
        student.className.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesClass = !this.selectedClass || student.className === this.selectedClass;
      
      return matchesSearch && matchesClass;
    });
  }
}
