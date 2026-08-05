import Image from "next/image";
import Link from "next/link";

export default function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <nav className="pop-nav" aria-label="Main navigation">
      <Link href="/" className="pop-nav-logo" aria-label="Pop Events home">
        {compact ? <span>POP EVENTS</span> : <Image src="/reference/pop-events-logo.png" alt="Pop Events" width={110} height={42} priority />}
      </Link>
      {compact ? (
        <Link className="pop-back" href="/">Back to Home</Link>
      ) : (
        <ul>
          <li><a href="#contact">Contact</a></li>
          <li><Link className="pop-nav-cta" href="/register">Vendor Register</Link></li>
        </ul>
      )}
    </nav>
  );
}
