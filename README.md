# BudgetBuddy

![GitHub package.json version](https://img.shields.io/github/package-json/v/rafaumeu/budgetbuddy)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/rafaumeu/budgetbuddy/main.yml)
![GitHub issues](https://img.shields.io/github/issues/rafaumeu/budgetbuddy)
![GitHub pull requests](https://img.shields.io/github/issues-pr/rafaumeu/budgetbuddy)
![GitHub License](https://img.shields.io/github/license/rafaumeu/budgetbuddy)
![GitHub last commit](https://img.shields.io/github/last-commit/rafaumeu/budgetbuddy)
![Node.js Version](https://img.shields.io/node/v/rafaumeu/budgetbuddy)

Bem-vindo ao **BudgetBuddy**, o seu gerenciador de transações pessoal! Com o BudgetBuddy, você pode facilmente acompanhar suas finanças, registrar suas transações e obter um resumo da sua conta em um piscar de olhos. Seja você um usuário casual ou um planejador financeiro, o BudgetBuddy foi projetado para atender às suas necessidades.

## Funcionalidades

✨ **Principais Recursos:**

- **Criação de Transações:** Registre novas transações com facilidade, seja crédito ou débito.
- **Resumo da Conta:** Obtenha um resumo claro e conciso da sua conta, ajudando você a tomar decisões financeiras informadas.
- **Listagem de Transações:** Visualize todas as transações que você já realizou, organizadas de forma prática.
- **Visualização de Transação Única:** Veja os detalhes de uma transação específica sempre que precisar.

## Requisitos de Negócio

- 💰 **Tipos de Transação:** As transações podem ser do tipo crédito (que somam ao total) ou débito (que subtraem do total).
- 👤 **Identificação do Usuário:** O sistema garante que cada usuário possa visualizar apenas suas próprias transações, mantendo sua privacidade e segurança.
- 🔍 **Controle Total:** Você tem controle total sobre suas transações, podendo visualizar apenas aquelas que você criou.

## Tecnologias Utilizadas

- **Node.js**: Para a construção do backend.
- **Fastify**: Um framework web altamente eficiente para Node.js.
- **Knex**: Um construtor de consultas SQL que facilita a interação com o banco de dados.
- **SQLite3**: Um banco de dados leve e confiável para armazenar suas transações.
- **Zod**: Para validação de dados, garantindo que suas entradas sejam sempre seguras e consistentes.

## Como Começar

1. **Clone o repositório:**

```bash
git clone https://github.com/seuusuario/budgetbuddy.git
```

2. **Instale as dependências:**

```bash
cd budgetbuddy
npm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```plaintext
NODE_ENV=development
DATABASE_URL="./db/app.db"
```

Para testes, você pode criar um arquivo `.env.test` com:

```plaintext
NODE_ENV=test
DATABASE_URL="./db/test.db"
```

4. **Inicie o servidor:**

```bash
npm run dev
```

5. **Acesse o aplicativo:** Abra seu navegador e vá para `http://localhost:3000`.

## Contribuições

Contribuições são sempre bem-vindas! Se você quiser ajudar a melhorar o BudgetBuddy, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo **LICENSE** para mais detalhes.

Sinta-se à vontade para explorar, testar e, mais importante, gerenciar suas finanças de forma eficaz com o BudgetBuddy! 💸
