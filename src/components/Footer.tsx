import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 py-10">
      <Container>
        <div className="text-sm text-neutral-600">
          <div>Arlington, TN</div>
          <div className="mt-2 flex flex-wrap gap-4">
            <a className="underline" href="https://www.linkedin.com/in/dean-reese"
              target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="underline" href="https://homebaseddaddy.com/"
              target="_blank" rel="noreferrer">Home Based Daddy</a>
            <a className="underline" href="https://sunnytexts.com"
              target="_blank" rel="noreferrer">Sunny Texts</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
