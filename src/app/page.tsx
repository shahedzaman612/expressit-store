import StoreForm from "@/componants/StoreForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Create a store</h1>
        <p className="mb-6 mt-2 text-gray-600">
          Add your basic store information and complete the setup
        </p>

        
        <StoreForm />
      </div>
    </main>
  );
}
