"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center px-4 text-center font-sans">
        <p className="text-sm font-medium text-blue-700">Something went wrong</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">SK Academy</h1>
        <p className="mt-2 max-w-md text-gray-600">
          An unexpected error occurred. Please refresh the page or try again later.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
