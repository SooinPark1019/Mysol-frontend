import Link from "next/link"

export default function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">This is the about page content.</p>
      <Link href="/" className="text-blue-500 underline">
        Back to Home
      </Link>
    </div>
  )
}

