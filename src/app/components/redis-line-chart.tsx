import { Legend, Line } from "recharts";

import { CartesianGrid, XAxis, YAxis } from "recharts";

import { LineChart } from "recharts";

import { ResponsiveContainer } from "recharts";

interface RedisLineChartProps {
    data: any[];
    dataKey: string;
    lineColor: string;
    legendName?: string;
}


export default function RedisLineChart({ data, dataKey, lineColor, legendName }: RedisLineChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                    dataKey="time"
                    stroke="#666"
                    fontSize={13}
                    tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: '#9ca3af' }}
                />
                <Line
                    name={legendName}
                    type="basis"
                    dataKey={dataKey}
                    stroke={lineColor}
                    dot={false}
                    strokeWidth={2}
                />
                <Legend 
                    verticalAlign="top" 
                    height={36} 
                    wrapperStyle={{ fontWeight: 'bold' }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}