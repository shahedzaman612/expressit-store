import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: { secure_url: string }[];
  video?: { secure_url: string };
  category?: { name: string };
}

async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(
      "https://glore-bd-backend-node-mongo.vercel.app/api/product",
      { cache: "no-store" }
    );
    const data = await res.json();
    if (!res.ok || !data.data) return null;
    return data.data.find((p: Product) => p._id === id) || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ✅ Optional: Generate SEO metadata for each product
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | ExpressIT Store`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.images?.[0]?.secure_url || ""],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/Products"
            className="text-indigo-600 text-sm hover:underline transition"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden md:flex md:gap-10 md:p-8">
          <div className="md:w-1/2 w-full">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.images?.[0]?.secure_url || "/placeholder.jpg"}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover w-full h-full transition-transform hover:scale-105 duration-300 rounded-lg"
              />
            </div>
            {product.video?.secure_url && (
              <video
                controls
                className="mt-4 w-full rounded-lg shadow"
                src={product.video.secure_url}
              />
            )}
          </div>

          <div className="md:w-1/2 w-full flex flex-col justify-between mt-8 md:mt-0">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {product.name}
              </h1>
              <div className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 inline-block px-3 py-1 rounded-full uppercase tracking-wide font-medium">
                {product.category?.name || "Uncategorized"}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-indigo-600 mt-4">
                ৳ {product.price}
              </div>
            </div>
            <div className="mt-8">
              <button className="w-full md:w-auto px-6 py-3 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
