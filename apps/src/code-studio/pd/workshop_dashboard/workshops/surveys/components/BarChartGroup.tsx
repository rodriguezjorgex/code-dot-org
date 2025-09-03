import {Box} from '@mui/material';
import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  // Label,
  Rectangle,
} from 'recharts';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

const data2 = [
  {label: '0–2', value: 9, color: '#22a66f'},
  {label: '3–7', value: 2, color: '#f5a623'},
  {label: '8–15', value: 0, color: '#e25555'},
  {label: '16+', value: 2, color: '#22b8cf'},
];

// optional: control Y max to hit nice ticks like 0..12
const yMax = Math.max(...data2.map(d => d.value), 10);
const niceMax = Math.min(12, Math.max(10, yMax + 2));

type BarChartGroupProps = {
  width?: number;
  height?: number;
};

const BarChartGroup: React.FC<BarChartGroupProps> = ({
  width = 374,
  height = 144,
}) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: '1px dashed',
      borderColor: 'divider',
      p: 2,
    }}
  >
    {/*<ResponsiveContainer width="100%" height="100%">*/}
    <BarChart height={height} width={width} data={data2}>
      <CartesianGrid vertical={false} strokeDasharray="4 4" />
      <XAxis
        dataKey="label"
        tickLine={false}
        axisLine={false}
        interval={0}
        tick={{fontSize: 14}}
      >
        some other text
        {/*<Label*/}
        {/*  value="YEARS TAUGHT"*/}
        {/*  offset={14}*/}
        {/*  position="bottom"*/}
        {/*  style={{fill: '#64748B', fontSize: 12, fontWeight: 600}}*/}
        {/*/>*/}
      </XAxis>
      <YAxis
        domain={[0, niceMax]}
        allowDecimals={false}
        tickLine={false}
        axisLine={false}
        tick={{fontSize: 14}}
      >
        some text here
        {/*<Label*/}
        {/*  value="RESPONSES"*/}
        {/*  angle={-90}*/}
        {/*  position="insideLeft"*/}
        {/*  style={{*/}
        {/*    textAnchor: 'middle',*/}
        {/*    fill: '#64748B',*/}
        {/*    fontSize: 12,*/}
        {/*    fontWeight: 600,*/}
        {/*  }}*/}
        {/*  offset={-4}*/}
        {/*/>*/}
      </YAxis>
      <Bar
        dataKey="value"
        fill="#8884d8"
        shape={<Rectangle />}
        label={{position: 'top'}}
      >
        {data2.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
        ))}
      </Bar>
    </BarChart>
    {/*</ResponsiveContainer>*/}
  </Box>
);

export default BarChartGroup;
