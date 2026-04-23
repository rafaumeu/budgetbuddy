# BudgetBuddy

A personal transaction manager to track finances with credit and debit operations.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Fastify** | HTTP framework |
| **Knex** | SQL query builder |
| **SQLite3** | Database |
| **Zod** | Input validation |

## Features

- **Transaction Creation** — Record credit or debit transactions
- **Account Summary** — Get a concise overview of your balance
- **Transaction Listing** — View all transactions organized by date
- **Single Transaction View** — Check details of a specific transaction

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/transactions` | Create a new transaction |
| `GET` | `/transactions` | List all transactions |
| `GET` | `/transactions/:id` | Get a specific transaction |
| `GET` | `/summary` | Get account summary |

## Getting Started

```bash
git clone https://github.com/rafaumeu/budgetbuddy.git
cd budgetbuddy
npm install
```

Create a `.env` file:

```env
NODE_ENV=development
DATABASE_URL="./db/app.db"
```

```bash
npm run dev
```

The server runs on `http://localhost:3000`.

## Testing

Create a `.env.test` file:

```env
NODE_ENV=test
DATABASE_URL="./db/test.db"
```

```bash
npm test
```

## License

ISC
