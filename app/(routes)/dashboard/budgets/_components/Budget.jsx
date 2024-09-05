import Link from 'next/link';
import React from 'react';

const Budget = ({ refreshData, item }) => {
    const percent = Math.round((item?.totalSpend / item?.amount) * 100);
    const maxpercent = Math.min(percent, 100);
    const progressBarColor = percent > 100 ? 'bg-destructive' : 'bg-primary';

    return (
        <Link href={'/dashboard/expenses/' + item?.id}>
            <div className="p-4 h-[180px] border rounded-lg hover:shadow-md cursor-pointer">
                <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <h2 className="rounded-full bg-accent text-2xl p-3">
                            {item?.icon}
                        </h2>
                        <div>
                            <h2 className="font-bold">
                                {item?.name}
                            </h2>
                            <h2 className="font-light text-xs">
                                {item?.totalItems} Item(s)
                            </h2>
                        </div>
                    </div>
                    <h2 className="font-bold text-primary">${Number(item?.amount).toFixed(2)}</h2>
                </div>
                <div className="mt-5">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xs text-accent-foreground">
                            ${item?.totalSpend ? Number(item?.totalSpend).toFixed(2) : '0.00'}
                        </h2>
                        <h2 className="text-xs text-accent-foreground">
                            ${item?.amount > item?.totalSpend 
                                ? Number(item?.amount - item?.totalSpend).toFixed(2) 
                                : '0.00'} remaining
                        </h2>
                    </div>
                    <div className="w-full rounded-full bg-accent h-2">
                        <div
                            className={`rounded-full h-2 ${progressBarColor}`}
                            style={{ width: `${maxpercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Budget;
