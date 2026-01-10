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

- **Frontend**: Next.js 15, SWR for optimized data fetching, Tailwind CSS, Framer Motion.
- **Backend**: NestJS, BullMQ + Redis for background scraping, TypeORM.
- **Database**: SQLite (Development), PostgreSQL ready.
- **CI/CD**: GitHub Actions for lint/test/build.

## 🛠️ Key Features

- **Hierarchical Navigation**: Discover headings and categories directly from WOB.
- **On-Demand Deep Scraper**: High-performance scraping with deduplication & TTL caching.
- **Recommendation Engine**: Dynamic related products based on category context.
- **Navigation History**: Persistent user paths synced between client and server.
- **Advanced Search**: Rich filters (price, categories) and optimized grid views.

## 🧪 Testing & Seeding

```bash
# Seed sample data
cd backend && npm run seed

# Run Backend Tests (Unit + E2E)
cd backend && npm test

# Frontend Lint
cd frontend && npm run lint
```

## 📖 Deployment

### Backend (Render/Railway)
- Provide `REDIS_HOST` and `REDIS_PORT` for BullMQ.
- Mount a persistent volume for SQLite OR configure a PostgreSQL instance.

### Frontend (Vercel)
- Set `NEXT_PUBLIC_API_URL` to your production backend URL.

## 📜 Design Decisions

1. **BullMQ Worker Model**: Decouples scraping from the request thread, ensuring high reliability and scalability.
2. **SWR for Frontend**: Implements stale-while-revalidate for snappy UI and automatic background updates.
3. **Crawl Deduplication & TTL**: Smart caching (24h default) prevents overloading the source site and ensures data freshness.
4. **Monorepo structure**: Simplifies orchestrating both services and shared configurations.
