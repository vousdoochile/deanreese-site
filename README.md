# Dean Reese personal site

Next.js site for https://deanreese.me, deployed through GitHub and Vercel.

## One source of truth for the website AND AI Q&A

**Edit these two files when updating public content:**

- `src/content/site.ts`: headline, location, professional experience, founder portfolio, projects, areas of focus, resume highlights, education and certifications.
- `src/content/writing.ts`: articles, publication dates, summaries, bullet points and complete article bodies. To add a post, also add its slug to `writingOrder` in the same file.

The Home, Work, Writing, article and online Resume pages read these shared content files. The chatbot's `src/lib/siteContent.ts` generates its approved knowledge directly from those same files. There is no second set of descriptions or manually copied article text to maintain.

## Publish updates

Push changes to GitHub's `main` branch. Vercel will automatically build and deploy. The chatbot's knowledge updates as part of that deployment. You do not need to re-enter the same facts in the chatbot.

## Boundaries

- Only information explicitly approved for publication in these source files is included. Do not add private Stripe account details, internal metrics, customer identities or other secrets.
- The **PDF resume** in `public/Dean Reese - Resume.pdf` is a separate binary file. Replacing it or updating its details is a separate step and is **not** automatic.
- External sites such as `homebaseddaddy.com` are linked, but not automatically crawled or copied. Add any new approved facts to `src/content/site.ts`.
- The chatbot answers from approved content; this limits guessing but cannot guarantee error-free answers. Test new content with known and unknown questions.

## Develop and validate

```powershell
npm install
npm run build
```

Create `.env.local` with `OPENAI_API_KEY` to test the chat API locally (never commit secrets). In production the key lives in Vercel environment variables.
