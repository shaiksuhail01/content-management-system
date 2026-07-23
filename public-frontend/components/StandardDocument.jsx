"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import BlockRenderer from "./BlockRenderer";

const StandardDocument = ({
  standard,
}) => {
  const versions =
    standard?.versions || [];

  /*
   * Prefer certified version.
   * Otherwise use the first available version.
   */
  const defaultVersion =
    versions.find(
      (version) =>
        version.status ===
        "certified"
    ) ||
    versions[0] ||
    null;

  const [
    selectedVersionId,
    setSelectedVersionId,
  ] = useState(
    defaultVersion?._id || ""
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    activeSectionId,
    setActiveSectionId,
  ] = useState("");

  const [
    copiedSectionId,
    setCopiedSectionId,
  ] = useState("");

  /*
   * Get currently selected version.
   */
  const activeVersion =
    versions.find(
      (version) =>
        version._id ===
        selectedVersionId
    ) || defaultVersion;

  /*
   * Sort sections by CMS order.
   */
  const sections = useMemo(() => {
    return [
      ...(activeVersion?.sections ||
        []),
    ].sort(
      (a, b) =>
        (a.order || 0) -
        (b.order || 0)
    );
  }, [activeVersion]);

  /*
   * Convert block content into searchable text.
   */
  const getBlockSearchText = (
    block
  ) => {
    if (!block?.data) {
      return "";
    }

    const data = block.data;

    const textParts = [];

    if (
      typeof data.text ===
      "string"
    ) {
      textParts.push(data.text);
    }

    if (
      typeof data.expression ===
      "string"
    ) {
      textParts.push(
        data.expression
      );
    }

    if (
      typeof data.latex ===
      "string"
    ) {
      textParts.push(data.latex);
    }

    if (
      Array.isArray(data.items)
    ) {
      textParts.push(
        data.items
          .map((item) =>
            typeof item ===
            "string"
              ? item
              : item?.text || ""
          )
          .join(" ")
      );
    }

    if (
      Array.isArray(data.headers)
    ) {
      textParts.push(
        data.headers.join(" ")
      );
    }

    if (
      Array.isArray(data.rows)
    ) {
      textParts.push(
        data.rows
          .flat(Infinity)
          .join(" ")
      );
    }

    return textParts.join(" ");
  };

  /*
   * Search navigation.
   *
   * Search checks:
   * - section number
   * - section title
   * - paragraph content
   * - headings
   * - lists
   * - tables
   * - equations
   *
   * Main document remains fully visible.
   */
  const filteredSections =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {
        return sections;
      }

      return sections.filter(
        (section) => {
          const searchableText = [
            section.sectionNumber ||
              "",

            section.title || "",

            ...(section.blocks ||
              []).map(
              getBlockSearchText
            ),
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            query
          );
        }
      );
    }, [sections, searchTerm]);

  /*
   * Track which section is currently
   * visible while scrolling.
   */
  useEffect(() => {
    if (!sections.length) {
      setActiveSectionId("");
      return;
    }

    setActiveSectionId(
      sections[0]._id
    );

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (
            visibleEntries.length ===
            0
          ) {
            return;
          }

          const elementId =
            visibleEntries[0]
              .target.id;

          const sectionId =
            elementId.replace(
              "section-",
              ""
            );

          setActiveSectionId(
            sectionId
          );
        },
        {
          root: null,

          rootMargin:
            "-15% 0px -65% 0px",

          threshold: [
            0,
            0.1,
            0.25,
            0.5,
          ],
        }
      );

    sections.forEach(
      (section) => {
        const element =
          document.getElementById(
            `section-${section._id}`
          );

        if (element) {
          observer.observe(
            element
          );
        }
      }
    );

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  /*
   * Format CMS dates.
   */
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * Determine nested section depth.
   *
   * 1       => depth 1
   * 1.1     => depth 2
   * 1.1.1   => depth 3
   */
  const getSectionDepth = (
    sectionNumber = ""
  ) => {
    return (
      sectionNumber
        .split(".")
        .filter(Boolean)
        .length || 1
    );
  };

  /*
   * Change version.
   */
  const handleVersionChange = (
    event
  ) => {
    setSelectedVersionId(
      event.target.value
    );

    setSearchTerm("");

    setActiveSectionId("");
  };

  /*
   * Copy direct section URL.
   */
  const handleCopyLink = async (
    sectionId
  ) => {
    const url =
      `${window.location.origin}` +
      `${window.location.pathname}` +
      `#section-${sectionId}`;

    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopiedSectionId(
        sectionId
      );

      window.setTimeout(() => {
        setCopiedSectionId("");
      }, 1500);
    } catch (error) {
      console.error(
        "Unable to copy section link:",
        error
      );
    }
  };

  /*
   * No versions available.
   */
  if (!activeVersion) {
    return (
      <div className="border-t border-gray-200 py-14 text-gray-500">
        No published documentation is
        currently available.
      </div>
    );
  }

  return (
    <div className="grid gap-10 border-t border-gray-200 py-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14 lg:py-12">
      {/* =========================
          LEFT SIDEBAR
      ========================== */}

      <aside>
        <div className="lg:sticky lg:top-6">
          {/* SEARCH */}

          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              aria-label="Search sections"
              className="h-11 w-full rounded-full border border-gray-300 bg-white px-5 pr-11 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-500"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">
              ⌕
            </span>
          </div>

          {/* VERSION */}

          <div className="mt-7">
            <p className="text-sm font-medium text-gray-500">
              Version
            </p>

            <select
              value={
                activeVersion._id
              }
              onChange={
                handleVersionChange
              }
              aria-label="Select version"
              className="mt-2 w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#292929] outline-none transition hover:border-gray-300 focus:border-gray-400"
            >
              {versions.map(
                (version) => (
                  <option
                    key={version._id}
                    value={version._id}
                  >
                    {
                      version.version
                    }

                    {version.label
                      ? ` - ${version.label}`
                      : ""}
                  </option>
                )
              )}
            </select>

            <div className="mt-3 text-xs leading-5 text-gray-500">
              <p className="capitalize">
                {activeVersion.status?.replaceAll(
                  "-",
                  " "
                )}
              </p>

              {(activeVersion.publishedDate ||
                activeVersion.startDate) && (
                <p>
                  {formatDate(
                    activeVersion.publishedDate ||
                      activeVersion.startDate
                  )}
                </p>
              )}
            </div>
          </div>

          {/* SECTION NAVIGATION */}

          <nav className="mt-6 border-t border-gray-200 pt-5">
            {filteredSections.length ===
            0 ? (
              <div className="rounded-lg bg-gray-50 px-3 py-4">
                <p className="text-sm text-gray-500">
                  No matching sections.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSections.map(
                  (section) => {
                    const depth =
                      getSectionDepth(
                        section.sectionNumber
                      );

                    const isActive =
                      activeSectionId ===
                      section._id;

                    return (
                      <a
                        key={
                          section._id
                        }
                        href={`#section-${section._id}`}
                        style={{
                          paddingLeft:
                            `${(depth - 1) * 14}px`,
                        }}
                        onClick={() =>
                          setActiveSectionId(
                            section._id
                          )
                        }
                        className={`block rounded-md py-1.5 text-sm leading-5 transition ${
                          isActive
                            ? "font-medium text-red-600"
                            : depth ===
                                1
                              ? "font-medium text-gray-700 hover:text-red-600"
                              : "text-gray-500 hover:text-red-600"
                        }`}
                      >
                        <span>
                          {
                            section.sectionNumber
                          }
                        </span>{" "}

                        {
                          section.title
                        }
                      </a>
                    );
                  }
                )}
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* =========================
          DOCUMENT CONTENT
      ========================== */}

      <article className="min-w-0">
        {sections.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
            <p className="text-gray-500">
              No sections are available
              for this version.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map(
              (section) => (
                <section
                  key={section._id}
                  id={`section-${section._id}`}
                  className="scroll-mt-28"
                >
                  {/* SECTION TITLE */}

                  <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                    <h2 className="min-w-0 text-xl font-semibold leading-snug text-[#292929] md:text-2xl">
                      <span className="mr-3">
                        {
                          section.sectionNumber
                        }
                      </span>

                      {
                        section.title
                      }
                    </h2>

                    <button
                      type="button"
                      title="Copy section link"
                      aria-label={`Copy link to ${section.title}`}
                      onClick={() =>
                        handleCopyLink(
                          section._id
                        )
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-sm text-gray-500 transition hover:border-gray-500 hover:text-gray-900"
                    >
                      {copiedSectionId ===
                      section._id
                        ? "✓"
                        : "↗"}
                    </button>
                  </div>

                  {/* CONTENT BLOCKS */}

                  <div className="pt-1">
                    {[...(
                      section.blocks ||
                      []
                    )]
                      .sort(
                        (a, b) =>
                          (a.order ||
                            0) -
                          (b.order ||
                            0)
                      )
                      .map(
                        (block) => (
                          <BlockRenderer
                            key={
                              block._id
                            }
                            block={
                              block
                            }
                          />
                        )
                      )}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </article>
    </div>
  );
};

export default StandardDocument;