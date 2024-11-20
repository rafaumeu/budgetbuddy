# BudgetBuddy

![GitHub package.json version](https://img.shields.io/github/package-json/v/rafaumeu/budgetbuddy) ![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![GitHub issues](https://img.shields.io/github/issues/rafaumeu/budgetbuddy) ![GitHub pull requests](https://img.shields.io/github/issues-pr/rafaumeu/budgetbuddy) ![License](https://img.shields.io/badge/License-ISC-blue.svg) ![GitHub last commit](https://img.shields.io/github/last-commit/rafaumeu/budgetbuddy) ![Node.js](https://img.shields.io/badge/Node.js-v18.0.0-brightgreen) ![Fastify](https://img.shields.io/badge/Fastify-v4.12.0-blue) ![SQLite](https://img.shields.io/badge/SQLite-v5.1.4-yellow) ![Test Status](https://img.shields.io/badge/tests-passing-brightgreen)

Welcome to **BudgetBuddy**, your personal transaction manager! With BudgetBuddy, you can easily track your finances, record your transactions, and get an overview of your account in the blink of an eye. Whether you're a casual user or a financial planner, BudgetBuddy is designed to meet your needs.

## Features
✨ **Key Features:**
- **Transaction Creation:** Easily record new transactions, whether credit or debit.
- **Account Summary:** Get a clear and concise summary of your account, helping you make informed financial decisions.
- **Transaction Listing:** View all transactions you've made, organized conveniently.
- **Single Transaction View:** See the details of a specific transaction whenever you need.

## Business Requirements
- 💰 **Transaction Types:** Transactions can be credit (which add to the total) or debit (which subtract from the total).
- 👤 **User Identification:** The system ensures that each user can only view their own transactions, maintaining privacy and security.
- 🔍 **Full Control:** You have total control over your transactions, able to view only those you've created.

## Technologies Used
- **Node.js**: For backend construction.
- **Fastify**: A highly efficient web framework for Node.js.
- **Knex**: A SQL query builder that facilitates database interaction.
- **SQLite3**: A lightweight and reliable database to store your transactions.
- **Zod**: For data validation, ensuring your inputs are always safe and consistent.

## Getting Started
1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/budgetbuddy.git
```

2. **Install dependencies:**
```bash
cd budgetbuddy
npm install
```

3. **Configure environment variables:**
Create a `.env` file in the project root with the following settings:
```plaintext
NODE_ENV=development
DATABASE_URL="./db/app.db"
```
For testing, you can create a `.env.test` file with:
```plaintext
NODE_ENV=test
DATABASE_URL="./db/test.db"
```

4. **Start the server:**
```bash
npm run dev
```

5. **Access the application:** Open your browser and go to `http://localhost:3000`.

## Project Structure
- `src/`: Source code directory
- `db/`: Database files
- `tests/`: Test files
- `.env`: Environment configuration
- `package.json`: Project dependencies and scripts

## API Endpoints
- `POST /transactions`: Create a new transaction
- `GET /transactions`: List all transactions
- `GET /transactions/:id`: Retrieve a specific transaction
- `GET /summary`: Get account summary

## Error Handling
The application uses comprehensive error handling to provide meaningful feedback:
- Validation errors
- Authentication errors
- Database connection errors

## Performance Considerations
- Efficient database queries using Knex.js
- Minimal overhead with Fastify
- Lightweight SQLite database

## Future Roadmap
- [ ] Implement transaction categories
- [ ] Add data visualization
- [ ] Create mobile application
- [ ] Integrate with bank APIs

## Contributions
Contributions are always welcome! If you want to help improve BudgetBuddy, feel free to open an issue or send a pull request.

## License
This project is licensed under the ISC License - see the **LICENSE** file for more details.

Feel free to explore, test, and most importantly, manage your finances effectively with BudgetBuddy! 💸

