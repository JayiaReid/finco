import React from 'react'
import { useState } from 'react'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'
import { db } from '../../../../../utils/dbConfig'
import { Savings, SavingsDeposits } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'

const AddDeposit = ({refreshData, left, saved, id}) => {
    const [amount, setAmount] = useState('')
    const {user} = useUser()

    const convertTimestampToDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${day}/${month}/${year}`;
    };

    const Deposit = async () =>{
        try {
            const result = await db.insert(SavingsDeposits).values({
                id: Date.now(),
                amount,
                savingsId: id,
                createdBy: user.id 
            })
            if(result){
                const res = await db.update(Savings).set({
                    saved: Number(saved)+Number(amount),
                    left: Number(left)-Number(amount)
                }).where(eq(Savings.id, id))
                if(res){
                    console.log('sucess')
                    refreshData()
                }
            }
        } catch (error) {
            console.log(error)
        }
       


    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add to Savings</h2>
            <div className='p-3 flex flex-col gap-2'>
                <h2>Expense Amount</h2>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="eg. 5000" />
            </div>
            <div className='p-3 flex flex-col gap-2'>
                <h2>Deposit Date</h2>
                <Input value={convertTimestampToDate(Date.now())} readonly />
            </div>
            <Button disabled={!(amount)} onClick={() => Deposit()}>Add New Deposit</Button>
        </div>
    )
}

export default AddDeposit