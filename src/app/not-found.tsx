import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-script text-4xl text-moss">Oh dear</p>
      <h1 className="font-serif text-5xl text-ink">This page wandered off</h1>
      <p className="mt-4 text-brown">The invitation you are looking for is on the home page.</p>
      <Link href="/" className="btn btn-primary mt-8">Back to the invitation</Link>
    </main>
  );
}
