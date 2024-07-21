import React from 'react'
import BudgetList from './_components/List'
import CreateBudget from './_components/CreateBudget'

const Budgets = () => {
  return (
    <div className='p-10'>
      <h2 className='p-5 font-bold text-3xl'>My Budgets</h2>
      <BudgetList/>
    </div>
  )
}

export default Budgets