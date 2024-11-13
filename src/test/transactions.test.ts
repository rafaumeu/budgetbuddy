import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '../app'

beforeAll(async () => {
  await app.ready()
})
afterAll(async () => {
  await app.close()
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
})