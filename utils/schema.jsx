import { boolean, integer, PgNumeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Budgets=pgTable('budgets',{
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:varchar('amount').notNull(),
    icon:varchar('icon'),
    createdBy:varchar('createdBy').notNull(),
    retired:boolean('retired')
})

export const Expenses=pgTable('expenses', {
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:varchar('amount').notNull(),
    budgetId:varchar('budgetId').references(()=>Budgets.id),
    createdBy:varchar('createdBy').notNull()
})

export const Plans=pgTable('plans',{
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    icon:varchar('icon'),
    notes:varchar('notes'),
    createdBy:varchar('createdBy').notNull(),
    retired:boolean('retired')
})

export const PlanItems = pgTable('planItems',{
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    notes:varchar('notes'),
    price:varchar('price'),
    color:varchar('color'),
    keyword:varchar('keyword'),
    createdBy:varchar('createdBy').notNull(),
    planId:varchar('planId').references(()=>Plans.id)
})


// export const UserStats = pgTable('userStats',{
//     id:varchar('id').primaryKey(),
//     income:varchar('income').notNull(),
//     userid:varchar('userid').notNull(),
//     month:varchar('month'),
//     year:varchar('year')
// })

export const Income = pgTable('income',{
    id:varchar('id').primaryKey(),
    income:varchar('income').notNull(),
    userid:varchar('userid').notNull(),
    month:varchar('month'),
    year:varchar('year')
})

export const Bills = pgTable('bills',{
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    charge:varchar('charge').notNull(),
    consistency:boolean('consistency').notNull(),
    repeats:boolean('repeats').notNull(),
    date:varchar('date').notNull(),
    createdBy:varchar('createdBy').notNull(),
    paid:boolean('paid'),
    icon:varchar('icon'),
    continued:boolean('continued')
})

export const Savings = pgTable('savings', {
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    goal: varchar('goal').notNull(),
    saved: varchar('saved'),
    left:varchar('left'),
    reached:boolean('reached'),
    createdBy:varchar('createdby'),
    icon:varchar('icon'),
    retired:boolean('retired')
})

export const SavingsDeposits = pgTable('savingsDeposits',{
    id:varchar('id').primaryKey(),
    savingsId:varchar('savingsId').references(()=>Savings.id),
    amount:varchar('amount'),
    createdBy:varchar('createdby')
})
