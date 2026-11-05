import Container from "../../components/Container";
import Link from "next/link";
import { orderedWritingPosts } from "../../content/writing";

export default function WritingPage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
      <p className="mt-2 text-neutral-700">
        Notes from hands-on builds, systems integration, technical delivery, and applied AI.
      </p>
      <div className="mt-10 space-y-4">
        {orderedWritingPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="block rounded-xl border border-neutral-200 p-5 hover:border-neutral-300"
          >
            <div className="text-sm font-semibold">{post.title}</div>
            <div className="mt-1 text-sm text-neutral-500">{post.date}</div>
            <div className="mt-3 text-sm text-neutral-700">{post.summary}</div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
