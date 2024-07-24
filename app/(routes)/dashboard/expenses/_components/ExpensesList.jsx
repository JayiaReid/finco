import { Trash } from 'lucide-react';
import React from 'react'
import { db } from '../../../../../utils/dbConfig';
import { Expenses } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from '../../../../../components/ui/use-toast';

const ExpensesList = ({list, refreshData}) => {

    const convertTimestampToDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const DeleteExpense = async (id) => {
        try {
            if (!id) {
                throw new Error("Invalid ID provided");
            }
            const result = await db.delete(Expenses).where(eq(Expenses.id, id));
            if (result.rowCount === 0) {
                throw new Error("No expense found with the provided ID");
            }
            toast("Expense deleted successfully"); //not working
            refreshData()
        } catch (error) {
            toast("Error deleting expense");
            throw error;
        }

    };
    
  return (
    <div className='mt-3 border'>
        <div className='font-bold bg-primary text-primary-foreground grid grid-cols-4 p-2'>
            <h2>
                Name
            </h2>
            <h2>
                Amount
            </h2>
            <h2>
                Date
            </h2>
            <h2>
                Action
            </h2>
        </div>
        {list?.map((expense, index)=>(
            <div className='grid grid-cols-4 bg-muted p-2'>
            <h2>
                {expense?.name}
            </h2>
            <h2>
                {expense?.amount}
            </h2>
            <h2>
            {convertTimestampToDate(expense?.id)}
            </h2>
            <h2 className='cursor-pointer'>
                <Trash onClick={()=>DeleteExpense(expense?.id)} className='text-destructive'/>
            </h2>
        </div>
        ))}
    </div>
  )
}

export default ExpensesList