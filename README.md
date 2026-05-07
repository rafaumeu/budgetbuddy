<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=FFCA28&height=180&section=header&text=BudgetBuddy%20&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Personal%20Finance%20Transaction%20Manager&descSize=18&descAlignY=52"/>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodejs" alt="Node.js"/> <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify" alt="Fastify"/> <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite" alt="SQLite"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
</p>

## Overview

A lightweight personal finance manager for tracking income and expenses with **Fastify** and **SQLite**. Simple, fast, and self-contained — no external database needed.

## Features

- Credit and debit transaction recording
- Account balance summary
- Transaction history with date filtering
- Input validation with Zod
- RESTful API design

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/transactions` | Create transaction |
| `GET` | `/transactions` | List all transactions |
| `GET` | `/transactions/:id` | Get specific transaction |
| `GET` | `/summary` | Get balance summary |

## API Documentation

Interactive Swagger UI available at `/docs` when running the server.

### Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/transactions` | Create a credit or debit transaction |
| `GET` | `/transactions` | List all transactions |
| `GET` | `/transactions/:id` | Get a specific transaction |
| `GET` | `/summary` | Get account balance summary |

### Generate Typed Client

```bash
npx orval  # generates typed API client from OpenAPI spec
```

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Fastify** | HTTP framework |
| **SQLite3** | Embedded database |
| **Knex** | SQL query builder |
| **Zod** | Input validation |

## Getting Started

```bash
git clone https://github.com/rafaumeu/budgetbuddy.git
cd budgetbuddy
npm install
npm run dev
```

## License

MIT

<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=FFCA28&height=100&section=footer"/>
  <br/><sub>Built with ❤️ by <a href="https://github.com/rafaumeu">Rafael Zendron</a></sub>
</div>

<p align="center">
  <a href="https://github.com/rafaumeu/budgetbuddy/generate"><img src="https://img.shields.io/badge/Use_This_Template-FFCA28?style=for-the-badge&logo=github&logoColor=white" alt="Use this template"/></a>
</p>

