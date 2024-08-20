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
import ItemsTable from '../_components/ItemsTable'

const Page = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [info, setInfo] = useState({});
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);


  useEffect(() => {
    if (user) {
      getPlanInfo();
    }
  }, [user, id]);


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

  const retirePlan = async (state)=>{

    const result = await db.update(Plans).set({
      retired:state
    }).where(eq(Plans.id, info.id))

    if(result){
      console.log('retired')
      router.push('/dashboard/plans'); 
    }
  }

  return (
    <div className='p-10'>
      <h2 onClick={() => router.push('/dashboard/plans')} className='m-2 cursor-pointer items-end justify-end font-semibold flex gap-2'>
        <ArrowLeftToLine /> Go Back to Plans
      </h2>
      <div className='flex items-center my-4 justify-between'>
        <h2 className='text-3xl font-bold'>{info?.name}</h2>
        <div className='flex items-center gap-2'>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>Delete</Button>
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
          {info.retired==true? <Button variant='outline' onClick={()=>retirePlan(false)}>UnRetire</Button> :<Button variant='outline' onClick={()=>retirePlan(true)}>Retire</Button>}
        </div>
       
      </div>
      <Plan item={info} display={true} />

      <ItemsTable refreshData={getPlanInfo}/>
    </div>
  );
};

export default Page;

// price comparisons?
