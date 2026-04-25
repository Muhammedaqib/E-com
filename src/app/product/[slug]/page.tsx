import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/format";
import { parseProductImages } from "@/lib/product-utils";
import { prisma } from "@/lib/prisma";
import { ProductImageGallery } from "@/components/ProductImageGallery";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) return { title: "Product" };
  return { title: `${product.name} · BazarMart` };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  const images = parseProductImages(product.images);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductImageGallery images={images} productName={product.name} />

      <div>
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
          >
            {product.category.name}
          </Link>
        )}
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatMoney(product.price)}</span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-xl line-through text-slate-500">{formatMoney(product.compareAt)}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {product.stock > 0 ? (
            <span className="text-green-700 dark:text-green-400">In stock ({product.stock} available)</span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </p>
        <div className="mt-8">
          <AddToCartButton productId={product.id} stock={product.stock} />
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">About this item</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
