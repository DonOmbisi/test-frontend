# Student Data Processor - Frontend

A modern Angular application for the Student Data Processor system with a clean, responsive Material Design interface.

## 🚀 Features

- **Data Generation**: Generate Excel files with random student data
- **Data Processing**: Convert Excel files to CSV with score updates
- **Database Operations**: Upload CSV files to Supabase database
- **Reports Module**: View, filter, and export student data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material Design**: Modern UI components with Angular Material

## 🛠️ Tech Stack

- **Angular**: 18.0.0
- **Angular Material**: 18.0.0
- **TypeScript**: 5.4.0
- **SCSS**: Styling with CSS preprocessor
- **RxJS**: Reactive programming

## 📋 Prerequisites

- Node.js 18+ and npm
- Angular CLI 18+
- Backend Spring Boot application running

## ⚙️ Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

### 3. Build for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── data-generation/     # Excel file generation
│   │   ├── data-processing/     # Excel to CSV conversion
│   │   ├── database/           # Database upload operations
│   │   └── reports/            # Data viewing and export
│   ├── app.component.ts        # Main application component
│   ├── app.config.ts           # Application configuration
│   └── app.routes.ts           # Routing configuration
├── styles.scss                 # Global styles
└── main.ts                     # Application bootstrap
```

## 🎯 Component Overview

### Data Generation Component
- Form input for number of student records (1 - 1,000,000)
- Generates Excel files with random student data
- Real-time progress indication
- Success/error feedback

### Data Processing Component
- File upload for Excel files (.xlsx, .xls)
- Converts to CSV with score updates (+10)
- File validation and error handling
- Processing status display

### Database Component
- CSV file upload to Supabase
- Score updates (+5) during upload
- Database record count display
- Upload status and results

### Reports Component
- Paginated data table display
- Search by Student ID
- Filter by Class (Class1-Class5)
- Export options (Excel, CSV, PDF)
- Responsive table design

## 🔧 Configuration

### Backend API URL
The application is configured to connect to the backend at:
```
http://localhost:8080/api
```

To change this, update the URLs in each component's service calls.

### Environment Variables
Create an `environment.ts` file for different configurations:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 🎨 UI/UX Features

- **Material Design**: Consistent with Google's Material Design guidelines
- **Responsive Layout**: Adapts to different screen sizes
- **Loading States**: Progress bars and spinners for async operations
- **Error Handling**: User-friendly error messages and validation
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark/Light Theme**: Material Design theme system

## 📱 Responsive Design

The application is fully responsive and includes:
- Mobile-first design approach
- Flexible grid layouts
- Adaptive navigation
- Touch-friendly controls
- Optimized for various screen sizes

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
ng e2e
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built application can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any static file hosting service

## 🔒 Security Considerations

- CORS configuration for backend communication
- Input validation and sanitization
- File type validation
- Secure HTTP communication (HTTPS in production)

## 📊 Performance Features

- Lazy loading of components
- Optimized bundle size
- Efficient change detection
- Memory leak prevention
- Progressive Web App capabilities

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured correctly
2. **Build Errors**: Check Node.js and Angular CLI versions
3. **Material Design Issues**: Verify Angular Material installation
4. **Routing Issues**: Check route configuration and lazy loading

### Debug Mode
Enable debug logging in the browser console for troubleshooting.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub
- Contact the development team
