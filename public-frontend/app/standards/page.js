import Link from "next/link";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import {
  getStandards,
} from "../../lib/api";

const StandardsPage = async () => {
  let standards = [];
  let error = "";

  try {
    standards =
      await getStandards();
  } catch (err) {
    console.error(
      "Unable to load standards:",
      err
    );

    error =
      "Unable to load standards.";
  }

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      <Header />

      <main className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
        {/* HERO */}

        <section className="pb-14 pt-16 md:pb-16 md:pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
            <span className="font-bold text-red-600">
              ✓✓
            </span>

            <span className="text-gray-700">
              Standards
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-medium italic tracking-tight text-[#292929] md:text-6xl">
            RenewCred Standards
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-gray-600 md:text-base">
            Explore RenewCred standards
            and their structured
            documentation, managed
            dynamically through the
            RenewCred content management
            system.
          </p>
        </section>

        {/* STANDARDS */}

        <section className="border-t border-gray-200 pb-20">
          {error && (
            <div className="mt-10 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          {!error &&
            standards.length === 0 && (
              <div className="py-16 text-center text-gray-500">
                No published standards
                are currently available.
              </div>
            )}

          {!error &&
            standards.map(
              (standard) => (
                <article
                  key={standard._id}
                  className="border-b border-gray-200 py-9"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                    <div className="max-w-5xl">
                      <div className="flex items-center gap-3">
                        {standard.icon && (
                          <span className="text-2xl">
                            {
                              standard.icon
                            }
                          </span>
                        )}

                        <h2 className="text-xl font-medium text-[#292929] md:text-2xl">
                          {
                            standard.title
                          }
                        </h2>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-gray-600 md:text-[15px]">
                        {
                          standard.summary
                        }
                      </p>
                    </div>

                    <Link
                      href={`/standards/${standard.slug}`}
                      className="mt-1 shrink-0 text-sm font-medium text-gray-700 underline underline-offset-4 transition hover:text-red-600"
                    >
                      Read more
                    </Link>
                  </div>
                </article>
              )
            )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StandardsPage;