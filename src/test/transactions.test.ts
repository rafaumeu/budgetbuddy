import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../app'

beforeAll(async () => {
  await app.ready()
  execSync('npm run knex migrate:latest')
})
afterAll(async () => {
  await app.close()
})
afterEach(() => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

describe('Transactions routes', () => {

  it('should be able to create a new transaction', async () => {
    await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit'
    })
    .expect(201)
  })

  it('should be able to create a new transaction with a category', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Grocery shopping',
        amount: 150,
        type: 'debit',
        category: 'FOOD',
      })
      .expect(201)
  })

  it('should default category to OTHER when not provided', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createResponse.get('Set-Cookie') ?? []
    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listResponse.body.transactions[0].category).toBe('OTHER')
  })

  it('should reject an invalid category', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Bad category',
        amount: 100,
        type: 'debit',
        category: 'INVALID_CATEGORY',
      })
      .expect(400)
  })

  it('should be able to get all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
    const cookies = createTransactionResponse.get('Set-Cookie') ?? []
    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000
      })
    ])
  })

  it('should be able get expecific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      const cookies = createTransactionResponse.get('Set-Cookie') ?? []
      const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

      const transactionId = listTransactionsResponse.body.transactions[0].id
      const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

      expect(getTransactionResponse.body.transaction).toEqual(
        expect.objectContaining({
          title: 'New transaction',
          amount: 5000
      })
    )
  })

  it('should be able to get summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
    const cookies = createTransactionResponse.get('Set-Cookie') ?? []
    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)
    expect(summaryResponse.body.summary).toEqual({
      amount: 5000
    })
  })

  it('should be able to list transactions filtered by category', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Groceries',
        amount: 100,
        type: 'debit',
        category: 'FOOD',
      })

    const cookies = createResponse.get('Set-Cookie') ?? []

    // Create another transaction with a different category
    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Bus ticket',
        amount: 5,
        type: 'debit',
        category: 'TRANSPORT',
      })

    const filteredResponse = await request(app.server)
      .get('/transactions/category/FOOD')
      .set('Cookie', cookies)
      .expect(200)

    expect(filteredResponse.body.transactions).toHaveLength(1)
    expect(filteredResponse.body.transactions[0]).toEqual(
      expect.objectContaining({
        title: 'Groceries',
        amount: -100,
        category: 'FOOD',
      })
    )
  })

  it('should return empty array for category with no transactions', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Groceries',
        amount: 100,
        type: 'debit',
        category: 'FOOD',
      })

    const cookies = createResponse.get('Set-Cookie') ?? []

    const filteredResponse = await request(app.server)
      .get('/transactions/category/TRANSPORT')
      .set('Cookie', cookies)
      .expect(200)

    expect(filteredResponse.body.transactions).toHaveLength(0)
  })

  it('should require authentication for category endpoint', async () => {
    await request(app.server)
      .get('/transactions/category/FOOD')
      .expect(401)
  })

  it('should be able to get monthly summary grouped by category', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salary',
        amount: 5000,
        type: 'credit',
        category: 'SALARY',
      })

    const cookies = createResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Groceries',
        amount: 200,
        type: 'debit',
        category: 'FOOD',
      })

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'More food',
        amount: 100,
        type: 'debit',
        category: 'FOOD',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary/monthly')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.monthly).toHaveLength(2)

    const salaryRow = summaryResponse.body.monthly.find(
      (row: any) => row.category === 'SALARY'
    )
    expect(salaryRow).toBeDefined()
    expect(Number(salaryRow.total)).toBe(5000)
    expect(Number(salaryRow.count)).toBe(1)

    const foodRow = summaryResponse.body.monthly.find(
      (row: any) => row.category === 'FOOD'
    )
    expect(foodRow).toBeDefined()
    expect(Number(foodRow.total)).toBe(-300)
    expect(Number(foodRow.count)).toBe(2)

    expect(Number(summaryResponse.body.overall.amount)).toBe(4700)
  })

  it('should require authentication for monthly summary endpoint', async () => {
    await request(app.server)
      .get('/transactions/summary/monthly')
      .expect(401)
  })
})
