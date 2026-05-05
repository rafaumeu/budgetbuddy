
declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      category: string
      created_at: string
      session_id?: string
    }
  }
}
