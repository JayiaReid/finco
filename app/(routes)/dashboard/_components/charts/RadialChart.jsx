import React from 'react'
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const RadialChart = ({totalOut, billTotal, expenses, income}) => {

    const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042'];

  const data = [
    {
      name: `Bills $${billTotal}`,
      uv: (billTotal / totalOut),
      fill: colors[0],
    },
    ...expenses.map((expense, index) => ({
      name: `${expense.name} $${expense.uv}`,
      uv: (expense.uv / totalOut),
      fill: colors[index + 1],
    })),
  ];

  return (
    <div className='mt-5 border rounded-lg'>
         <h2 className='font-bold m-3 text-xl'>Total Expenses</h2>
        <div className='flex items-center justify-center p-0'>
       
        <ResponsiveContainer width={"90%"} height={350}>
            <RadialBarChart
        //   width={600}
        //   height={300}
          innerRadius={40}
          outerRadius={100}
          data={data}
          startAngle={360}
          endAngle={0}
        >
          <RadialBar label={false} minAngle={10} background clockWise={true} dataKey='uv' />
          <Legend iconSize={10} width={200} height={200} layout='vertical' verticalAlign='right' align="left" />
          
        </RadialBarChart>
        </ResponsiveContainer>
        
      </div>
    </div>
    
  )
}

export default RadialChart