import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white px-5 pt-5 md:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between rounded-xl border border-gray-200 bg-white px-6 shadow-sm lg:px-8">
        {/* LOGO */}

        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-[#292929]"
        >
          Renew
          <span className="text-red-600">
            ✓
          </span>
          Cred
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/buyers"
            className="text-sm font-medium text-gray-700 transition hover:text-red-600"
          >
            Buyers
          </Link>

          <Link
            href="/suppliers"
            className="text-sm font-medium text-gray-700 transition hover:text-red-600"
          >
            Suppliers
          </Link>

          <Link
            href="/climate"
            className="text-sm font-medium text-gray-700 transition hover:text-red-600"
          >
            Climate & Us
          </Link>

          <Link
            href="/science"
            className="text-sm font-medium text-gray-700 transition hover:text-red-600"
          >
            Science
          </Link>

          <Link
            href="/standards"
            className="text-sm font-medium text-red-600"
          >
            Standards
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 transition hover:text-red-600"
          >
            Contact Us
          </Link>
        </nav>

        {/* REGISTRY */}

        <Link
          href="/registry"
          className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-900 hover:text-white"
        >
          Registry
        </Link>
      </div>
    </header>
  );
};

export default Header;