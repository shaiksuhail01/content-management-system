import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import StandardDocument from "../../../components/StandardDocument";

import {
  getStandardBySlug,
} from "../../../lib/api";

const StandardDetailPage =
  async ({ params }) => {
    const { slug } = await params;

    let standard = null;

    try {
      standard =
        await getStandardBySlug(
          slug
        );
    } catch (error) {
      console.error(
        "Unable to load standard:",
        error
      );
    }

    /*
     * STANDARD NOT FOUND
     */
    if (!standard) {
      return (
        <div className="flex min-h-screen flex-col bg-white text-[#292929]">
          <Header />

          <main className="mx-auto flex w-full max-w-[1440px] flex-1 px-6 py-20 md:px-10 lg:px-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
                <span className="font-bold text-red-600">
                  ✓✓
                </span>

                <span className="text-gray-700">
                  Standards
                </span>
              </div>

              <h1 className="mt-7 text-3xl font-semibold tracking-tight md:text-4xl">
                Standard not found
              </h1>

              <p className="mt-4 leading-7 text-gray-500">
                The requested standard
                could not be loaded or is
                not currently published.
              </p>
            </div>
          </main>

          <Footer />
        </div>
      );
    }

    return (
      <div className="flex min-h-screen flex-col bg-white text-[#292929]">
        <Header />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 md:px-10 lg:px-12">
          {/* =========================
              STANDARD HERO
          ========================== */}

          <section className="pb-12 pt-14 md:pb-16 md:pt-20">
            {/* BADGE */}

            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
              <span className="font-bold text-red-600">
                ✓✓
              </span>

              <span className="text-gray-700">
                Standards
              </span>
            </div>

            {/* TITLE */}

            <h1 className="mt-6 max-w-5xl text-4xl font-medium italic tracking-tight text-[#292929] sm:text-5xl md:text-6xl">
              {standard.title}
            </h1>

            {/* SUMMARY */}

            <p className="mt-5 max-w-4xl text-[15px] leading-7 text-gray-600 md:text-base">
              {standard.summary}
            </p>
          </section>

          {/* =========================
              INTERACTIVE DOCUMENT
          ========================== */}

          <StandardDocument
            standard={standard}
          />
        </main>

        <Footer />
      </div>
    );
  };

export default StandardDetailPage;