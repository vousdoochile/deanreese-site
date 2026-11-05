import Container from "../../../components/Container";
import Link from "next/link";
import type { Metadata } from "next";
import { writingPosts, orderedWritingPosts } from "../../../content/writing";

export function generateStaticParams() {
  return orderedWritingPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = writingPosts[params.slug];
  return post ? { title: post.title, description: post.summary, ...(post.coverImage ? { openGraph: { images: [post.coverImage] } } : {}) } : { title: "Writing" };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = writingPosts[params.slug];
  if (!post) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-neutral-700">This post is not available.</p>
        <div className="mt-6"><Link href="/writing" className="text-sm underline">Back to Writing</Link></div>
      </Container>
    );
  }

  return (
    <Container>
      <Link href="/writing" className="text-sm underline text-neutral-700">Back to Writing</Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{post.date}</p>
      {post.coverImage ? (
        <figure className="article-cover">
          <img src={post.coverImage} alt={post.coverAlt || post.title} width={840} height={840} />
          {post.coverCaption ? <figcaption>{post.coverCaption}</figcaption> : null}
        </figure>
      ) : null}
      <div className="mt-8 rounded-xl border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Key points</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
          {post.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </div>
      <div className="mt-8 space-y-4 text-sm leading-7 text-neutral-800">
        {post.body.split("\n\n").map((paragraph, index) =>
          paragraph.startsWith("## ") ? (
            <h2 className="article-section-title" key={index}>{paragraph.slice(3)}</h2>
          ) : (
            <p key={index}>{paragraph}</p>
          )
        )}
      </div>
      {post.references?.length ? (
        <section className="article-references">
          <h2>Hardware and open-source references</h2>
          <ul>{post.references.map((ref) => (
            <li key={ref.url}><a href={ref.url} target="_blank" rel="noreferrer">{ref.label} ↗</a></li>
          ))}</ul>
        </section>
      ) : null}
    </Container>
  );
}
