'use client';

import { useMemo } from 'react';
import { useProducts } from '@/hooks/use-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';
import type { ProductCategory } from '@/lib/types';

const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
];

const categoryLabels: Record<ProductCategory, string> = {
  iPhone: 'iPhone',
  iPad: 'iPad',
  Mac: 'Mac',
  Watch: 'Watch',
  AirPods: 'AirPods',
  Accesorios: 'Accesorios',
};

export default function AnalyticsPage() {
  const { data, isLoading } = useProducts({ limit: 1000 });

  const categoryData = useMemo(() => {
    if (!data?.items) return [];

    const grouped = data.items.reduce((acc, item) => {
      const cat = item.categoria;
      if (!acc[cat]) {
        acc[cat] = { stock: 0, count: 0, value: 0 };
      }
      acc[cat].stock += item.stock;
      acc[cat].count += 1;
      acc[cat].value += parseFloat(item.precio) * item.stock;
      return acc;
    }, {} as Record<string, { stock: number; count: number; value: number }>);

    return Object.entries(grouped).map(([name, data], index) => ({
      name: categoryLabels[name as ProductCategory] || name,
      stock: data.stock,
      count: data.count,
      value: data.value,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [data]);

  const stockByCondition = useMemo(() => {
    if (!data?.items) return [];

    const nuevo = data.items.filter((i) => !i.usado).reduce((acc, i) => acc + i.stock, 0);
    const usado = data.items.filter((i) => i.usado).reduce((acc, i) => acc + i.stock, 0);

    return [
      { name: 'Nuevo', value: nuevo, fill: '#10b981' },
      { name: 'Usado', value: usado, fill: '#f59e0b' },
    ];
  }, [data]);

  const memoryDistribution = useMemo(() => {
    if (!data?.items) return [];

    const grouped = data.items.reduce((acc, item) => {
      const mem = item.memoria;
      if (!acc[mem]) acc[mem] = 0;
      acc[mem] += item.stock;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, stock], index) => ({
        name,
        stock,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => {
        const order = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Analíticas</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Estadísticas y gráficos del inventario
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Stock por Categoría */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Stock por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                stock: {
                  label: 'Stock',
                  color: '#3b82f6',
                },
              }}
              className="h-[250px] md:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ left: 0, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#888', fontSize: 12 }}
                    axisLine={{ stroke: '#333' }}
                  />
                  <YAxis
                    tick={{ fill: '#888', fontSize: 12 }}
                    axisLine={{ stroke: '#333' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Valor del Inventario por Categoría */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Valor por Categoría (USD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: 'Valor',
                  color: '#10b981',
                },
              }}
              className="h-[250px] md:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ left: 0, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#888', fontSize: 12 }}
                    axisLine={{ stroke: '#333' }}
                  />
                  <YAxis
                    tick={{ fill: '#888', fontSize: 12 }}
                    axisLine={{ stroke: '#333' }}
                    tickFormatter={(value) =>
                      `$${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    formatter={(value: number) =>
                      `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                    }
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Condición del Producto */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Productos: Nuevo vs Usado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: 'Cantidad',
                },
              }}
              className="h-[250px] md:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockByCondition}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: '#666' }}
                  >
                    {stockByCondition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribución por Memoria */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Stock por Capacidad de Memoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                stock: {
                  label: 'Stock',
                  color: '#8b5cf6',
                },
              }}
              className="h-[250px] md:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={memoryDistribution}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#888', fontSize: 12 }}
                    axisLine={{ stroke: '#333' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#888', fontSize: 12 }}
                    axisLine={{ stroke: '#333' }}
                    width={50}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
                    {memoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="mt-4 md:mt-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Resumen por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                    Categoría
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                    Productos
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                    Stock Total
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((cat) => (
                  <tr
                    key={cat.name}
                    className="border-b border-border/50 hover:bg-secondary/30"
                  >
                    <td className="py-3 px-4 font-medium">{cat.name}</td>
                    <td className="text-right py-3 px-4 text-muted-foreground">
                      {cat.count}
                    </td>
                    <td className="text-right py-3 px-4 text-muted-foreground">
                      {cat.stock.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${cat.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-secondary/30">
                  <td className="py-3 px-4">Total</td>
                  <td className="text-right py-3 px-4">
                    {categoryData.reduce((acc, c) => acc + c.count, 0)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {categoryData.reduce((acc, c) => acc + c.stock, 0).toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4">
                    ${categoryData
                      .reduce((acc, c) => acc + c.value, 0)
                      .toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
