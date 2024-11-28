# ProductiveFlow

ProductiveFlow is a modern task management and productivity tracking application built with Next.js 14, featuring real-time updates, team collaboration, and time tracking capabilities.

## Features

- **Task Management**
  - Create, update, and delete tasks
  - Drag-and-drop task status updates
  - Priority levels and due dates
  - Tag system for better organization

- **Team Collaboration**
  - Project-based organization
  - Team member management
  - Task assignment
  - Shared workspaces

- **Time Tracking**
  - Track time spent on tasks
  - Detailed time entry logs
  - Project-wise time analytics
  - Personal productivity insights

- **Analytics Dashboard**
  - Project progress overview
  - Team performance metrics
  - Time distribution charts
  - Task completion statistics

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Styling**: Tailwind CSS
- **Components**: Headless UI v2.2.0
- **UI Icons**: Heroicons v2.2.0
- **Drag & Drop**: Hello Pangea DnD v17.0.0
- **Form Handling**: React Hook Form v7.49.2
- **Notifications**: React Hot Toast v2.4.1
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/productiveflow.git
cd productiveflow
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/productiveflow"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
productiveflow/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── ui/               # Shared UI components
│   └── ...               # Feature components
├── lib/                   # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npx prisma studio` - Open Prisma database GUI

### Code Style

- ESLint configuration for TypeScript
- Prettier for code formatting
- Husky for pre-commit hooks

## Deployment

The application can be deployed to Vercel with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/productiveflow)

Remember to:
1. Set up environment variables in Vercel dashboard
2. Configure database connection
3. Run database migrations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors who participate in this project
