import { notFound } from "next/navigation";

async function getProductById(id: string) {
  try {
    const res = await fetch(
      "https://glore-bd-backend-node-mongo.vercel.app/api/product",
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!res.ok || !data.data) {
      console.error("Invalid response:", data);
      return null;
    }

    const product = data.data.find((p: any) => p._id === id);
    return product || null;
  } catch (error) {
    console.error("Error fetching product list:", error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <a
            href="/Products"
            className="text-indigo-600 text-sm hover:underline transition"
          >
            ← Back to Products
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden md:flex md:gap-10 md:p-8">
          {/* Left - Image / Video */}
          <div className="md:w-1/2 w-full">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.images?.[0]?.secure_url}
                alt={product.name}
                className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
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

          {/* Right - Info */}
          <div className="md:w-1/2 w-full flex flex-col justify-between mt-8 md:mt-0">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {product.name}
              </h1>

              <div className="text-sm bg-gray-100 text-gray-700 inline-block px-3 py-1 rounded-full uppercase tracking-wide font-medium">
                {product.category?.name || "Category"}
              </div>

              <p className="text-gray-600 text-base leading-relaxed">
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
