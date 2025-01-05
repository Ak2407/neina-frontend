import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <div className="p-4 space-y-8 bg-stone-100 min-h-screen">
      <div className="w-full flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="font-normal text-2xl  sm:text-3xl lg:text-5xl font-serif text-amber-700">
          Welcome, Reserve your table
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm lg:text-base ">
          Book your table at our restaurant for an unforgettable dining
          experience
        </p>
      </div>
      <BookingForm />
    </div>
  );
}
