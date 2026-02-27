'use client';

import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/use-products';
import { ProductsTable } from '@/components/dashboard/products-table';
import { ProductsFilters } from '@/components/dashboard/products-filters';
import { Pagination } from '@/components/dashboard/pagination';
import { ProductModal } from '@/components/dashboard/product-modal';
import { DeleteProductDialog } from '@/components/dashboard/delete-product-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductFilters, Producto } from '@/lib/types';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Producto | null>(null);

  const { data, isLoading, error } = useProducts(filters);
  const deleteProduct = useDeleteProduct();

  const handleEdit = (product: Producto) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product: Producto) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      toast.success('Producto eliminado correctamente');
      setDeletingProduct(null);
    } catch {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar los productos</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Intenta de nuevo más tarde'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gestiona el inventario de productos Apple
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="space-y-4">
        <ProductsFilters filters={filters} onFiltersChange={setFilters} />

        <ProductsTable
          products={data?.items || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {data?.meta && data.meta.totalPages > 1 && (
          <Pagination meta={data.meta} onPageChange={handlePageChange} />
        )}
      </div>

      <ProductModal
        open={isModalOpen}
        onClose={handleModalClose}
        product={editingProduct}
      />

      <DeleteProductDialog
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={confirmDelete}
        isDeleting={deleteProduct.isPending}
        productName={deletingProduct?.modelo}
      />
    </div>
  );
}
