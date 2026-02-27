'use client';

import { useProducts } from '@/hooks/use-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading } = useProducts({ limit: 1000 });

  const stats = {
    totalProducts: data?.meta?.total || 0,
    totalStock: data?.items?.reduce((acc, item) => acc + item.stock, 0) || 0,
    lowStock: data?.items?.filter((item) => item.stock < 5).length || 0,
    totalValue:
      data?.items?.reduce(
        (acc, item) => acc + parseFloat(item.precio) * item.stock,
        0
      ) || 0,
  };

  const statCards = [
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      icon: Package,
      format: (v: number) => v.toLocaleString(),
    },
    {
      title: 'Stock Total',
      value: stats.totalStock,
      icon: TrendingUp,
      format: (v: number) => v.toLocaleString(),
    },
    {
      title: 'Stock Bajo',
      value: stats.lowStock,
      icon: AlertTriangle,
      format: (v: number) => v.toLocaleString(),
      variant: 'warning' as const,
    },
    {
      title: 'Valor Inventario',
      value: stats.totalValue,
      icon: DollarSign,
      format: (v: number) =>
        new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'USD',
        }).format(v),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general del inventario
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-5 w-5 ${
                  stat.variant === 'warning'
                    ? 'text-amber-500'
                    : 'text-muted-foreground'
                }`}
              />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">
                  {stat.format(stat.value)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.items
                  ?.filter((item) => item.stock < 5)
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                    >
                      <div>
                        <p className="font-medium">{item.modelo}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.categoria} - {item.memoria}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-amber-500">
                        {item.stock} unidades
                      </span>
                    </div>
                  ))}
                {(!data?.items || data.items.filter((i) => i.stock < 5).length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    No hay productos con stock bajo
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Productos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.items?.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                  >
                    <div>
                      <p className="font-medium">{item.modelo}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.categoria} - {item.color}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      ${parseFloat(item.precio).toLocaleString()}
                    </span>
                  </div>
                ))}
                {(!data?.items || data.items.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    No hay productos disponibles
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
