# Skin Gym Pro - Membership Management System

A comprehensive membership management dashboard for skin care businesses with marketing ROI tracking and proactive retention features.

## 🚀 Features

### Core Functionality
- **Multi-level Authentication**: Admin, Staff, and View-only roles
- **Member Database**: Comprehensive profiles with Aglow payment integration
- **Marketing Analytics**: Campaign ROI tracking and member source attribution
- **Retention System**: AI-powered at-risk member identification
- **Real-time Dashboard**: Live metrics and alerts

### Risk Indicators
- No product purchase in 3+ months
- No upcoming appointments
- No visit for 1+ month
- Payment failures
- Declining engagement patterns
- Missed appointments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Analytics**: Chart.js, React Query
- **Deployment**: Railway/Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup Steps

1. **Clone and Install**
```bash
cd skin-gym-pro
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

3. **Database Setup**
```bash
# Create PostgreSQL database
createdb skingym

# Run migrations
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

4. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🚀 Deployment

### Railway (Recommended)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Deploy**
```bash
railway login
railway init
railway add postgresql
railway up
```

3. **Set Environment Variables**
```bash
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_URL=https://yourdomain.railway.app
```

### Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Add PostgreSQL**
- Use Vercel Postgres or external provider like Supabase
- Update DATABASE_URL in Vercel dashboard

## 🔧 Configuration

### Database Schema
The app uses Prisma with PostgreSQL. Key models:
- User (authentication)
- Member (customer profiles)
- RiskAssessment (retention tracking)
- Campaign (marketing ROI)
- Visit, Purchase, Appointment tracking

### API Integrations

#### Aglow Payment System
```env
AGLOW_API_KEY=your-api-key
AGLOW_API_URL=https://api.aglow.com
```

#### Email Service
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 📊 Usage

### Admin Dashboard
- View real-time metrics
- Monitor at-risk members
- Track campaign performance
- Generate reports

### Member Management
- Add/edit member profiles
- Track visit history
- Monitor purchase patterns
- Schedule appointments

### Marketing Analytics
- Link campaigns to members
- Calculate ROI
- Track conversion rates
- Attribution reporting

### Retention Alerts
- Daily risk assessments
- Automated notifications
- Recommended actions
- Follow-up tracking

## 🔐 Security

- Role-based access control (RBAC)
- Encrypted sessions
- API rate limiting
- Audit logging
- GDPR compliant

## 📈 Development Roadmap

### Phase 1 ✅
- Core authentication
- Member database
- Basic dashboard

### Phase 2 ✅
- Risk tracking system
- Alert mechanisms
- Basic reporting

### Phase 3 (In Progress)
- Marketing analytics
- ROI calculations
- Advanced visualizations

### Phase 4 (Planned)
- Mobile app
- Automated workflows
- AI recommendations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file

## 🆘 Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@skingym.com

---

Built with ❤️ for the Skin Gym team