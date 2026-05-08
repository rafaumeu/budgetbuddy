<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=FFCA28&height=180&section=header&text=BudgetBuddy&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Personal%20Finance%20Transaction%20Manager&descSize=18&descAlignY=52"/>
</div>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node-18+-339933?style=for-the-badge&logo=nodejs"/>
  <img alt="Fastify" src="https://img.shields.io/badge/Fastify-4-000000?style=for-the-badge&logo=fastify"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript"/>
  <img alt="Knex" src="https://img.shields.io/badge/Knex-2-EC4899?style=for-the-badge"/>
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite"/>
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-3-6E9F18?style=for-the-badge"/>
  <img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker"/>
  <img alt="Zod" src="https://img.shields.io/badge/Zod-3-3E67B1?style=for-the-badge"/>
</p>

---

## Overview

A lightweight personal finance manager for tracking income and expenses with **Fastify** and **SQLite**. Simple, fast, and self-contained — no external database needed. Includes interactive Swagger UI documentation and typed API client generation.

## Features

- Credit and debit transaction recording
- Account balance summary with running totals
- Transaction history with date filtering
- Input validation with Zod schemas
- Interactive Swagger UI at `/docs`
- Typed API client generation via Orval

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/transactions` | Create a credit or debit transaction |
| `GET` | `/transactions` | List all transactions |
| `GET` | `/transactions/:id` | Get a specific transaction |
| `GET` | `/summary` | Get account balance summary |

> Interactive documentation available at `/docs` when running the server.

### Generate Typed Client

```bash
npx orval  # generates typed API client from OpenAPI spec
```

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Fastify 4** | HTTP framework |
| **TypeScript** | Type safety |
| **SQLite3** | Embedded database |
| **Knex** | SQL query builder |
| **Zod** | Input validation |
| **Vitest** | Test framework |
| **Swagger** | API documentation |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/rafaumeu/budgetbuddy.git
cd budgetbuddy
npm install
npm run dev
```

### Docker

```bash
docker compose up -d    # Start PostgreSQL + App on port 3333
docker compose down     # Stop
docker compose build    # Rebuild
```

Docker Compose services:
- **postgres** — PostgreSQL 14 on port 5432
- **app** — Application on port 3333

## License

MIT

<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=FFCA28&height=100&section=footer"/>
  <br/><sub>Built with ❤️ by <a href="https://github.com/rafaumeu">Rafael Zendron</a></sub>
</div>

<p align="center">
  <a href="https://github.com/rafaumeu/budgetbuddy/generate"><img src="https://img.shields.io/badge/Use_This_Template-FFCA28?style=for-the-badge&logo=github&logoColor=white" alt="Use this template"/></a>
</p>
