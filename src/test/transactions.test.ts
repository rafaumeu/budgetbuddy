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
})