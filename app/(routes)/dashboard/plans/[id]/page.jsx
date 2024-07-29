"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Plan from '../_components/Plan';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { PlanItems, Plans } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '../../../../../utils/dbConfig';
import { ArrowLeftToLine, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { Textarea } from '../../../../../components/ui/textarea';
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
  } from '../../../../../components/ui/alert-dialog'
import { toast } from '../../../../../components/ui/use-toast';

const Page = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [info, setInfo] = useState({});
  const [items, setItems] = useState([]);
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [keyword, setKeyword] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [add, setAdd] = useState(false);

  useEffect(() => {
    if (user) {
      getPlanInfo();
      getPlans();
    }
    
  }, [user, id]);


  const getPlans = async () => {
    if (!user) return;
    try {
      const result = await db
        .select({ ...getTableColumns(PlanItems) })
        .from(PlanItems)
        .where(eq(PlanItems.planId, id))
        .orderBy(desc(PlanItems.id));

      setItems(result);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const getPlanInfo = async () => {
    if (!user) return;
    try {
      const result = await db
        .select({
          ...getTableColumns(Plans),
          totalItems: sql`count(${PlanItems.id})`.mapWith(Number),
        })
        .from(Plans)
        .leftJoin(PlanItems, eq(Plans.id, PlanItems.planId))
        .where(eq(Plans.id, id))
        .groupBy(Plans.id);

      setInfo(result[0]);

      const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
      setTotal(totalPrice);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await db.delete(PlanItems).where(eq(PlanItems.id, itemId));
      toast({
        title: "Item deleted successfully"
      });
      getPlans();
    } catch (error) {
      toast({ title: "Error deleting item" });
      console.error('Error deleting item:', error);
    }
  };

  const addItem = async () => {
    try {
      await db.insert(PlanItems).values({
        name,
        keyword,
        price,
        notes,
        createdBy: user.id,
        id: Date.now(),
        planId: id
      });
      toast({
        title: "Item added successfully"
      });
      getPlans();
      setAdd(false);
    } catch (error) {
      toast({ title: "Error adding item" });
      console.error('Error adding item:', error);
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
      setTotal(totalPrice);
  };

  const deletePlan = async () => {
    try {
      if (!id) {
        throw new Error("Invalid ID provided");
      }
      await db.delete(PlanItems).where(eq(PlanItems.planId, id));
      const result2 = await db.delete(Plans).where(eq(Plans.id, id));
      
      if (result2.rowCount === 0) {
        throw new Error("No plan found with the provided ID");
      }
      toast({
        title: "Plan deleted successfully"
      });
      router.push('/dashboard/plans'); 
    } catch (error) {
      toast({ title: "Error deleting plan" });
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <div className='p-10'>
      <h2 onClick={() => router.push('/dashboard/plans')} className='m-2 cursor-pointer items-end justify-end font-semibold flex gap-2'>
        <ArrowLeftToLine /> Go Back to Plans
      </h2>
      <div className='flex items-center my-4 justify-between'>
        <h2 className='text-3xl font-bold'>{info?.name}</h2>
        <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='hover:bg-accent text-destructive bg-transparent outline-none border-none shadow-none'><Trash /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure you want to delete this plan?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  plan and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deletePlan()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </div>
      <Plan item={info} display={true} />

      <div>
        <Table className='mt-5'>
          <TableCaption>List of Potential Expenses</TableCaption>
          <TableHeader>
            <TableRow className='bg-primary p-2'>
              <TableHead className="text-white font-bold">Name</TableHead>
              <TableHead className="text-white font-bold">Keyword(s)</TableHead>
              <TableHead className="text-white font-bold">Price</TableHead>
              <TableHead className="text-white font-bold">Notes</TableHead>
              <TableHead className="text-white font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item?.id}>
                <TableCell className="font-medium">{item?.name}</TableCell>
                <TableCell>{item?.keyword}</TableCell>
                <TableCell>{item?.price}</TableCell>
                <TableCell>{item?.notes}</TableCell>
                <TableCell className='text-right text-destructive'><Trash className='cursor-pointer' onClick={() => deleteItem(item?.id)}/></TableCell>
              </TableRow>
            ))}
            {add ? (
              <TableRow>
                <TableCell className="font-medium border">
                  <Input className='border-none shadow-none p-2 rounded-none focus-visible:outline-none' onChange={(e) => setName(e.target.value)} />
                </TableCell>
                <TableCell className='border'>
                  <Input className='border-none shadow-none p-2 rounded-none focus-visible:outline-none' onChange={(e) => setKeyword(e.target.value)} />
                </TableCell>
                <TableCell className='border'>
                  <Input type='number' className='border-none shadow-none p-2 rounded-none focus-visible:outline-none' onChange={(e) => setPrice(Number(e.target.value))} />
                </TableCell>
                <TableCell className='border'>
                  <Textarea className='border-none shadow-none p-2 rounded-none focus-visible:outline-none' onChange={(e) => setNotes(e.target.value)} />
                </TableCell>
                <TableCell className='border-none text-right'>
                  <Button onClick={addItem}>Save</Button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell onClick={() => setAdd(true)} colSpan={5}>
                  <Button className='bg-transparent hover:bg-transparent hover:text-secondary-foreground text-secondary-foreground shadow-none border-none'>
                    + Add
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className='font-bold' colSpan={4}>Total</TableCell>
              <TableCell className="text-right font-bold">${total}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      changing total items need to be automatic when adding and deleting
      and add another component. the total also needs adjusting to apparently
    </div>
  );
};

export default Page;
