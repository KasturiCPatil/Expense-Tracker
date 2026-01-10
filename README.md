# Product Data Explorer — Full-Stack Assignment

A production-minded product exploration platform built with Next.js and NestJS, featuring real-time, on-demand scraping of **World of Books**.

## 🚀 Quick Start (Docker)

The easiest way to run the entire stack is using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Swagger Docs**: [http://localhost:3001/api](http://localhost:3001/api)

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: NestJS, TypeORM, Playwright + Crawlee for scraping.
- **Database**: SQLite (Development/Docker), PostgreSQL ready for production.
- **CI/CD**: GitHub Actions for linting and building.

## 🛠️ Key Features

- **Hierarchical Navigation**: Scrapes main headings and categories directly from World of Books.
- **On-Demand Scraping**: Trigger deep scrapes for specific categories or search terms.
- **Rich Metadata**: Extracts titles, authors, prices, ISBNs, descriptions, and condition.
- **Navigation History**: Persists user browsing paths client-side and syncs with the backend.
- **Deduplication**: Ensures unique products are stored and updated rather than duplicated.

## 📖 Deployment Instructions

### Frontend (Vercel/Render)
- Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- Deploy the `frontend/` directory.

### Backend (Render/Railway)
- Set `PORT` and environment variables for your production database.
- Deploy the `backend/` directory.

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend lint
cd frontend && npm run lint
```

## 📜 Design Decisions

1. **Monorepo Layout**: Consolidated `frontend/` and `backend/` for easier deployment and CI management.
2. **SQLite for Demo**: Used SQLite for zero-config local runs, while maintaining TypeORM entities that are PostgreSQL-compatible.
3. **Framer Motion**: Used for premium UI transitions and skeleton loading states.
4. **Crawlee + Playwright**: Chosen for robust headless browser scraping that handles modern SPA-like sites like World of Books.
