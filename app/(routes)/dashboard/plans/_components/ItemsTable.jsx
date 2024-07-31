"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Plan from './Plan';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Keywords, PlanItems, Plans } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '../../../../../utils/dbConfig';
import { ArrowLeftToLine, ChevronDown, Pencil, Trash } from 'lucide-react';
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
import { DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuGroup } from '../../../../../components/ui/dropdown-menu';

const ItemsTable = ({ refreshData }) => {

  const { id } = useParams();
  const { user } = useUser();
  const [info, setInfo] = useState({});
  const [items, setItems] = useState([]);
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [keyword, setKeyword] = useState('select a keyword');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [add, setAdd] = useState(false);
  const [add2, setadd2] = useState(false)
  const [color, setColor] = useState('')
  const [keywordList, setkeywordList] = useState([])
  const [existingId, setId] = useState(null)

  useEffect(() => {
    if (user) {
      getPlans();
    }
  }, [user, id]);


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

  const editItem = (id, name, keyword, notes, price, color) =>{

    setAdd(true)
    setId(id)
    setName(name)
    setKeyword(keyword)
    setNotes(notes)
    setPrice(price)
    setColor(color)
  }

  const addItem = async () => {
    try {

      const result = await db.delete(PlanItems).where(eq(PlanItems.id, existingId));

      await db.insert(PlanItems).values({
        name,
        keyword,
        color,
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
  };

  const getPlans = async () => {
    if (!user) return;
    try {
      const result = await db
        .select({ ...getTableColumns(PlanItems) })
        .from(PlanItems)
        .where(eq(PlanItems.planId, id))
        .orderBy(desc(PlanItems.id));

      setItems(result);

      const totalPrice = result.reduce((sum, item) => sum + Number(item.price), 0);
      setTotal(totalPrice);

    } catch (error) {
      console.error('Error fetching plans:', error);
    }

    refreshData()
  };

  return (
    <div>
      <Table className='mt-5'>
        <TableCaption>List of Potential Expenses</TableCaption>
        <TableHeader>
          <TableRow className='bg-primary p-2'>
            <TableHead className="text-white font-bold">Name</TableHead>
            <TableHead className="text-white font-bold">Price</TableHead>
            <TableHead className="text-white font-bold">Notes</TableHead>
            <TableHead className="text-white font-bold">Priority</TableHead>
            <TableHead className="text-white font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow className={`bg-${item?.color}-300`} key={item?.id}>
              <TableCell className="font-semibold">{item?.name}</TableCell>
              <TableCell>{item?.price}</TableCell>
              <TableCell>{item?.notes}</TableCell>
              <TableCell>{item?.keyword}</TableCell>
              <TableCell className='text-right '><div className='cursor-pointer flex gap-2'><Trash className='text-destructive cursor-pointer' onClick={() => deleteItem(item?.id)} /><Pencil onClick={()=>editItem(item?.id, item?.name, item?.keyword, item?.notes, item?.price, item?.color)}/></div></TableCell>
            </TableRow>
          ))}
          {add ? (
            <TableRow>
              <TableCell className="font-medium border">
                <Input value={name} placeHolder='Enter Name (required)' className='border-none shadow-none p-2 rounded-none focus-visible:outline-none' onChange={(e) => setName(e.target.value)} />
              </TableCell>
              <TableCell className='border'>
                <Input value={price} placeHolder='Enter Price' type='number' className='border-none shadow-none p-2 rounded-none focus-visible:outline-none' onChange={(e) => setPrice(Number(e.target.value))} />
              </TableCell>
              <TableCell className='border'>
                <Textarea value={notes} placeHolder='Add Notes' className='border-none shadow-none p-2 rounded-none focus-visible:outline-none' onChange={(e) => setNotes(e.target.value)} />
              </TableCell>
              <TableCell className='border'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={`bg-${color}-300`}>{keyword} <ChevronDown className='text-xs' /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Buying Status </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup className='p-2  flex flex-col gap-2' value={keyword} onValueChange={setKeyword}>
                      <DropdownMenuRadioItem onClick={()=>setColor('orange')} value="Low Priority"> <div className='flex gap-3 items-center'><div className='p-2 bg-orange-300 rounded-full'></div> <p>Low Priority</p></div></DropdownMenuRadioItem>
                      <DropdownMenuRadioItem onClick={()=>setColor('green')} value="Important"><div className='flex gap-3 items-center'><div className='p-2 bg-green-300 rounded-full'></div> <p>Important</p></div></DropdownMenuRadioItem>
                      <DropdownMenuRadioItem onClick={()=>setColor('yellow')} value="Is a Maybe"><div className='flex gap-3 items-center'><div className='p-2 bg-yellow-300 rounded-full'></div><p>Is a Maybe</p></div></DropdownMenuRadioItem>
                      <DropdownMenuRadioItem onClick={()=>setColor('blue')} value="Status Unclear"> <div className='flex gap-3 items-center'><div className='p-2 bg-blue-300 rounded-full'></div> <p>Priority Unclear</p></div></DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className='border-none flex items-center justify-center gap-2 text-right'>
                <Button variant='outline' onClick={() => setAdd(false)}>Cancel</Button>
                <Button disabled={!(name)} onClick={()=>addItem()}>Save</Button>
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
  )
}

export default ItemsTable