'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ProductFilters, ProductCategory } from '@/lib/types';
import { X } from 'lucide-react';

const categories: ProductCategory[] = [
  'iPhone',
  'iPad',
  'Mac',
  'Watch',
  'AirPods',
  'Accesorios',
];

const memorias = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
const colores = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Dorado', 'Plata', 'Gris Espacial'];

interface ProductsFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export function ProductsFilters({
  filters,
  onFiltersChange,
}: ProductsFiltersProps) {
  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters =
    filters.categoria ||
    filters.memoria ||
    filters.color ||
    filters.usado !== undefined ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.stockDisponible;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-40">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Categoría
          </Label>
          <Select
            value={filters.categoria || 'all'}
            onValueChange={(value) =>
              updateFilter('categoria', value === 'all' ? undefined : (value as ProductCategory))
            }
          >
            <SelectTrigger className="h-9 bg-secondary border-border">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-32">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Memoria
          </Label>
          <Select
            value={filters.memoria || 'all'}
            onValueChange={(value) =>
              updateFilter('memoria', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9 bg-secondary border-border">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {memorias.map((mem) => (
                <SelectItem key={mem} value={mem}>
                  {mem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Color
          </Label>
          <Select
            value={filters.color || 'all'}
            onValueChange={(value) =>
              updateFilter('color', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9 bg-secondary border-border">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {colores.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-28">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Precio Min
          </Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice || ''}
            onChange={(e) =>
              updateFilter(
                'minPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9 bg-secondary border-border"
          />
        </div>

        <div className="w-28">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Precio Max
          </Label>
          <Input
            type="number"
            placeholder="999999"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              updateFilter(
                'maxPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9 bg-secondary border-border"
          />
        </div>

        <div className="flex items-end gap-6 pb-0.5">
          <div className="flex items-center gap-2">
            <Switch
              id="usado"
              checked={filters.usado === true}
              onCheckedChange={(checked) =>
                updateFilter('usado', checked ? true : undefined)
              }
            />
            <Label htmlFor="usado" className="text-sm">
              Solo usados
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="stock"
              checked={filters.stockDisponible === true}
              onCheckedChange={(checked) =>
                updateFilter('stockDisponible', checked ? true : undefined)
              }
            />
            <Label htmlFor="stock" className="text-sm">
              Con stock
            </Label>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end pb-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
