import { ProductRegistClient } from "@/domain/mng/product/[productId]";

interface PageProps {
  params: Promise<{ productId: string }>;
}

async function ProductRegistServer({ params }: PageProps) {
  const { productId } = await params;

  return <ProductRegistClient productId={productId} />;
}

export default ProductRegistServer;
