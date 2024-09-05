import { CheckIcon } from 'lucide-react'
import React from 'react'
import { Checkbox } from '../../../../../components/ui/checkbox'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '../../../../../components/ui/dialog'

const PaidBillsComponent = ({paidBills, charge, setPaid, createNextBill, setcharge, deleteBill }) => {
  return (
    <div className='mt-5'>
        <h2 className='text-2xl font-bold'>Paid Bills</h2>
        {paidBills.length > 0 ? <div className='grid gap-4 mt-5 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2'>
          {paidBills.map((bill, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <h2 className="rounded-full bg-accent text-2xl p-3">
                    {bill?.icon}
                  </h2>
                  <div>
                    <h2 className="font-bold">
                      {bill?.name}
                    </h2>

                  </div>
                </div>
                <h2 className="font-bold text-primary">${Number(bill?.charge).toFixed(2)}</h2>
              </div>
              <h2 className='text-md mt-5 flex gap-3'><div className='font-semibold'>Bill Date:</div> {bill?.date}</h2>
              <h2 className='text-md mt-5 flex items-center gap-3'><CheckIcon className='cursor-pointer' id="status" onClick={() => setPaid(bill?.id, false)} /> <label htmlFor='status' className='font-semibold'>Paid?</label></h2>
              {bill?.repeats && bill?.consistency ?
                <h2 >
                  {bill?.continued == true ? <div className='text-md mt-5 flex items-center gap-3'>
                    <CheckIcon id="repeats" />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month</label>
                  </div> : <div className='text-md mt-5 flex items-center gap-3'>
                    <Checkbox id="repeats" onClick={() => createNextBill(bill, bill.charge)} />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month?</label>
                  </div>}

                </h2> : null}
              {bill?.repeats && bill?.consistency === false ? (
                bill.continued !== true ? (
                  <Dialog>
                    <DialogTrigger>
                      <h2 className='text-md mt-5 flex items-center gap-3'>
                        <Checkbox id="repeats" onClick={() => createNextBill(bill, bill.charge)} />
                        <label htmlFor='repeats' className='font-semibold'>Continues next month?</label>
                      </h2>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className='text-lg font-bold'>Enter next bill's charge</h2>
                      <Input
                        type='number'
                        placeholder='e.g. 200'
                        value={charge}
                        onChange={(e) => setcharge(e.target.value)}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => createNextBill(bill, charge)}>Create Next Bill</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className='text-md mt-5 flex items-center gap-3'>
                    <CheckIcon id="repeats" />
                    <label htmlFor='repeats' className='font-semibold'>Continues next month</label>
                  </div>
                )
              ) : null}
              <div className='flex justify-start mt-5 items-center text-destructive'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' className='shadow-sm'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure you want to delete this bill?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBill(bill.id)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          </div>
            </div>
          ))}
          
          </div> : <h2 className='text-lg p-5 flex justify-center'>No Paid Bills </h2>
        }
        

      </div>
  )
}

export default PaidBillsComponent