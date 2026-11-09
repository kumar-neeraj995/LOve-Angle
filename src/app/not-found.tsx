import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center bg-pink-50">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-600 mb-4">
        Page Not Found ❤️
      </h1>
      <p className="text-gray-600 mb-6">
        Oops! You seem to have wandered away from the proposal.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold transition-all shadow-md active:scale-95"
      >
        Return to Proposal ❤️
      </Link>
    </div>
  );
}
