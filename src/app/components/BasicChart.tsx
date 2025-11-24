'use client';

import { useDataStore } from '../store/dataStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function BasicChart() {
  const { transactions, categories } = useDataStore();

  const data = categories.map((category) => {
    const total = transactions
      .filter((t) => String(t.category_id) === String(category.id))
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: category.name, value: total };
  }).filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="p-4 border border-border rounded-lg bg-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Gastos por Categoría</h3>
        <div className="text-center text-muted-foreground py-8">No hay datos para mostrar</div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Gastos por Categoría</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
