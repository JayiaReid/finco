import React, { useState } from 'react'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'
import { Expenses } from '../../../../../utils/schema'
import { db } from '../../../../../utils/dbConfig'
import { toast } from '../../../../../components/ui/use-toast'

const AddExpense = ({budgetId, refreshData, userId}) => {

    const [ExpenseName, setExpenseName]=useState(null)
    const [amount, setAmount]=useState(null)

    const CreateExpense = async () => {
        const result = await db.insert(Expenses).values({
            id: Date.now(),
            name: ExpenseName,
            amount: amount,
            budgetId: budgetId,
            createdBy: userId
        })

        console.log(result)

        if (result) {
            refreshData()
            toast({
                title: "New Expense Added!"
            })
            // setAmount('')
            // setExpenseName('')


        } else {
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }

       
    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='p-3 flex flex-col gap-2'>
                <h2>Expense Name</h2>
                <Input onChange={(e) => setExpenseName(e.target.value)} placeholder="eg. Ford Truck" />
            </div>
            <div className='p-3 flex flex-col gap-2'>
                <h2>Expense Amount</h2>
                <Input type='number' onChange={(e) => setAmount(e.target.value)} placeholder="eg. 5000" />
            </div>
            <Button disabled={!(ExpenseName&&amount)} onClick={()=>CreateExpense()}>Add New Expense</Button>
        </div>
    )
}

export default AddExpense