import Container from "../../../components/Container";
import Link from "next/link";
import type { Metadata } from "next";
import { writingPosts, orderedWritingPosts } from "../../../content/writing";

// Render a limited subset of Markdown in approved article copy. Never inject raw HTML.
function renderArticleText(text: string) {
  return text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|\x60[^\x60]+\x60)/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.charCodeAt(0) === 96 && part.charCodeAt(part.length - 1) === 96 && part.length > 2) {
      return <code key={index} className="rounded bg-neutral-100 px-1 py-0.5">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export function generateStaticParams() {
  return orderedWritingPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = writingPosts[slug];
  return post ? { title: post.title, description: post.summary, ...(post.coverImage ? { openGraph: { images: [post.coverImage] } } : {}) } : { title: "Writing" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = writingPosts[slug];
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
          ) : paragraph.startsWith("- ") ? (
            <ul key={index} className="list-disc space-y-1 pl-6">
              {paragraph.split("\n").filter(Boolean).map((line, item) => (
                <li key={item}>{renderArticleText(line.replace(/^- /, ""))}</li>
              ))}
            </ul>
          ) : (
            <p key={index}>{renderArticleText(paragraph)}</p>
          )
        )}
      </div>
      {post.references?.length ? (
        <section className="article-references">
          <h2>Hardware and software</h2>
          <ul>{post.references.map((ref) => (
            <li key={ref.url}><a href={ref.url} target="_blank" rel="noreferrer">{ref.label} ↗</a></li>
          ))}</ul>
        </section>
      ) : null}
    </Container>
  );
}
