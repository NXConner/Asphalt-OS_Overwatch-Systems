
# Asphalt OS - Overwatch Systems

A comprehensive Google Maps-based management platform tailored for asphalt paving businesses.

## 🎯 Features

### Core Management
- **Job Management**: Complete job lifecycle tracking with Google Maps integration
- **Employee Tracking**: Real-time GPS tracking and timesheet management
- **Schedule Management**: Interactive calendar with drag-and-drop scheduling
- **Client Management**: Full CRM functionality with communication history

### Financial Management
- **Automated Invoicing**: Generate and manage invoices with payment tracking
- **Bid Management**: Track bids from submission to completion
- **Expense Tracking**: Categorized expense management with reporting
- **Payroll System**: Employee compensation tracking and management
- **Revenue Tracking**: Real-time revenue analytics

### Advanced Features
- **Weather Integration**: Draggable weather widget with forecasting
- **Google Maps Tools**: Measurement tools, drawing tools, directions
- **Photo Management**: HTML5 Canvas enhancement with S3 cloud storage
- **Advanced Reporting**: Comprehensive dashboards with data visualization
- **PWA Support**: Install as mobile app on Android/iOS
- **Achievement System**: Employee gamification and leaderboards
- **Equipment & Fleet Management**: Track assets and maintenance
- **Materials Inventory**: Manage materials and supplies
- **Training Management**: Employee training and certification tracking

### UI/UX
- **Black Gold Theme**: Professional dark theme optimized for the industry
- **Glitch Effects**: Modern cyberpunk-inspired UI elements
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Draggable Widgets**: Customizable workspace layout
- **Scrollable Sidebar**: Efficient navigation for all features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and Yarn
- PostgreSQL database
- Google Maps API key
- OpenWeather API key
- AWS S3 bucket (for file storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NXConner/Asphalt-OS_Overwatch-Systems.git
cd Asphalt-OS_Overwatch-Systems
```

2. Install dependencies:
```bash
cd app
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

4. Set up the database:
```bash
yarn prisma generate
yarn prisma db push
yarn prisma db seed
```

5. Run the development server:
```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

**Email:** admin@asphalt.com  
**Password:** admin123

## 📁 Project Structure

```
/asphalt_paving_maps/app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── jobs/              # Job management
│   ├── schedule/          # Scheduling
│   ├── financials/        # Financial management
│   ├── reports/           # Reporting & analytics
│   └── ...                # Other feature pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── maps/             # Google Maps components
│   └── ...               # Feature-specific components
├── lib/                   # Utility libraries
│   ├── db.ts             # Database client
│   ├── auth.ts           # Authentication
│   ├── s3.ts             # S3 file storage
│   └── ...               # Other utilities
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🔑 API Keys Required

### Google Maps API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Create credentials and copy the API key

### OpenWeather API
1. Visit [OpenWeather](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key from the dashboard

### AWS S3
1. Visit [AWS Console](https://aws.amazon.com/)
2. Create an S3 bucket
3. Configure IAM credentials with S3 access
4. Set up environment variables

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Maps**: Google Maps JavaScript API
- **Charts**: Recharts
- **Storage**: AWS S3
- **State Management**: React Hooks + Context

## 📱 Mobile Support

The application is a Progressive Web App (PWA) and can be installed on mobile devices:

### Android
1. Open the site in Chrome
2. Tap "Add to Home Screen" when prompted
3. The app will function like a native app

### iOS
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## 🎨 Theme Customization

The app includes an advanced theme system with the default "Black Gold" theme. Access theme settings from the dashboard sidebar to customize:
- Primary/secondary colors
- Font styles
- Border styles
- Component appearance

## 📊 Database Schema

The application uses a comprehensive Prisma schema with the following main models:
- User (authentication)
- Job (job management)
- Employee (employee tracking)
- Client (CRM)
- Invoice (billing)
- Bid (bid management)
- Expense (financial tracking)
- Revenue (income tracking)
- Equipment (fleet management)
- Material (inventory)
- Training (employee training)
- Achievement (gamification)

## 🔐 Security

- Environment variables for sensitive data
- NextAuth.js for secure authentication
- Password hashing with bcrypt
- API route protection with middleware
- Secure file upload to S3

## 📈 Future Enhancements

- Drone integration for aerial site surveys
- AI-powered surface detection
- Advanced analytics with machine learning
- Multi-location support
- Customer portal
- Mobile apps (React Native)

## 📄 License

This project is proprietary software for Asphalt OS - Overwatch Systems.

## 🤝 Support

For support, email support@asphalt-os.com or open an issue on GitHub.

## 🎉 Acknowledgments

Built with ❤️ for the asphalt paving industry.

---

**Version**: 1.0.0  
**Last Updated**: October 2025
