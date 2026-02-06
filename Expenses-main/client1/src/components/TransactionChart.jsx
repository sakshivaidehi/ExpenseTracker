import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ReferenceDot } from "recharts";
export default function TransactionChart({ data, selectedTransaction }) {
    // compute x value (ISO date) from selected transaction if available
    let selectedX = null;
    let selectedY = null;
    if (selectedTransaction && selectedTransaction.date) {
        selectedX = new Date(selectedTransaction.date).toISOString().split('T')[0];

        // try to locate corresponding y value in provided chart data
        const point = data && data.find(item => item.day === selectedX);
        if (point) {
            const typeKey = selectedTransaction.type === 'income' ? 'income' : 'expense';
            selectedY = point[typeKey] ?? point.expense ?? null;
        }
    }

    return (
        // 👇 This wrapper forces real dimensions so Recharts never gets -1
        <div className="w-full min-w-[0] aspect-[16/9] bg-[#1E293B] rounded-2xl p-2 sm:p-4">
            <AreaChart width={500} height={280} data={data}>
                <XAxis dataKey="day" tickFormatter={(v) => new Date(v).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="expense" fillOpacity={0.4} />
                <Area type="monotone" dataKey="income" fillOpacity={0.2} />

                {selectedX && (
                    <ReferenceLine x={selectedX} stroke="#F59E0B" strokeWidth={2} strokeOpacity={0.9} />
                )}

                {selectedX && selectedY != null && (
                    <ReferenceDot x={selectedX} y={selectedY} r={4} fill="#F59E0B" />
                )}
            </AreaChart>
        </div>
    );
}
