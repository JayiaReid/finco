import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import { Info } from 'lucide-react'

const Debt = () => {
  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold p-5 text-3xl'>Debt Dashboard</h2>
        <div className='flex gap-3 items-center'>
          {/* <CreateSavings refreshData={getSavingsList()} /> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info />
              </TooltipTrigger>
              <TooltipContent className='bg-secondary text-secondary-foreground'>
                <h2 className='font-bold p-2'>Track Debts</h2>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default Debt