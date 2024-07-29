import { integer, PgNumeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Budgets=pgTable('budgets',{
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:varchar('amount').notNull(),
    icon:varchar('icon'),
    createdBy:varchar('createdBy').notNull()
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
    createdBy:varchar('createdBy').notNull()
})

export const PlanItems = pgTable('planItems',{
    id:varchar('id').primaryKey(),
    name:varchar('name').notNull(),
    notes:varchar('notes'),
    price:varchar('price'),
    keyword:varchar('keyword'),
    createdBy:varchar('createdBy').notNull(),
    planId:varchar('planId').references(()=>Plans.id)
})