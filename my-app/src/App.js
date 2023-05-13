import './App.css';
import { PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



const data = [
  {name: "units completed", value: 17},
  {name: "lvl 2/3 electives available", value: 4},
  {name: "lvl 1 electives available", value: 5},
  {name: "projected units", value: 7},
]

const data1 = [
  {
    name: '2021 T1',
    degree1: 70,
    degree2: 84,
    amt: 24,
  },
  {
    name: '2021 T2',
    degree1: 75,
    degree2: 82,
    amt: 22,
  },
  {
    name: '2022 T1',
    degree1: 66,
    degree2: 90,
    amt: 22,
  },
  {
    name: '2022 T2',
    degree1: 69,
    degree2: 77,
    amt: 20,
  },
  {
    name: '2023 T1',
    degree1: 68,
    degree2: 71,
    amt: 21,
  },
  {
    name: '2023 T2',
    degree1: 72,
    degree2: 68,
    amt: 25,
  },
];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>CourseFlow Analytics view</h1>
      <div className="App">
      <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>

        <LineChart
          width={500}
          height={300}
          data={data1}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="degree2" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="degree1" stroke="#82ca9d" />
        </LineChart>
        </div>
    </div>
  );
}

export default App;
