"use client";

import {
  BlockMath,
  InlineMath,
} from "react-katex";

import "katex/dist/katex.min.css";

const BlockRenderer = ({ block }) => {
  if (!block) {
    return null;
  }

  const { type, data } = block;

  /*
   * HEADING
   */
  if (type === "heading") {
    const text =
      data?.text || "";

    const level =
      Number(data?.level) || 3;

    if (level === 2) {
      return (
        <h2 className="mb-4 mt-8 text-2xl font-semibold leading-snug text-[#292929]">
          {text}
        </h2>
      );
    }

    if (level === 4) {
      return (
        <h4 className="mb-3 mt-6 text-lg font-semibold leading-snug text-[#292929]">
          {text}
        </h4>
      );
    }

    return (
      <h3 className="mb-4 mt-7 text-xl font-semibold leading-snug text-[#292929]">
        {text}
      </h3>
    );
  }

  /*
   * PARAGRAPH
   */
  if (type === "paragraph") {
    return (
      <p className="my-5 max-w-5xl whitespace-pre-line text-[15px] leading-8 text-gray-700 md:text-base">
        {data?.text || ""}
      </p>
    );
  }

  /*
   * LIST
   */
  if (type === "list") {
    const items =
      Array.isArray(data?.items)
        ? data.items
        : [];

    const isOrdered =
      data?.style === "ordered" ||
      data?.ordered === true;

    const ListTag =
      isOrdered ? "ol" : "ul";

    return (
      <ListTag
        className={`my-5 space-y-2 pl-6 text-[15px] leading-7 text-gray-700 md:text-base ${
          isOrdered
            ? "list-decimal"
            : "list-disc"
        }`}
      >
        {items.map(
          (item, index) => (
            <li key={index}>
              {typeof item ===
              "string"
                ? item
                : item?.text ||
                  ""}
            </li>
          )
        )}
      </ListTag>
    );
  }

  /*
   * TABLE
   */
  if (type === "table") {
    const headers =
      Array.isArray(
        data?.headers
      )
        ? data.headers
        : [];

    const rows =
      Array.isArray(data?.rows)
        ? data.rows
        : [];

    return (
      <div className="my-7 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          {headers.length >
            0 && (
            <thead className="bg-gray-50">
              <tr>
                {headers.map(
                  (
                    header,
                    index
                  ) => (
                    <th
                      key={index}
                      className="border-b border-gray-200 px-5 py-4 font-semibold text-gray-900"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
          )}

          <tbody>
            {rows.map(
              (
                row,
                rowIndex
              ) => (
                <tr
                  key={
                    rowIndex
                  }
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {(
                    Array.isArray(
                      row
                    )
                      ? row
                      : []
                  ).map(
                    (
                      cell,
                      cellIndex
                    ) => (
                      <td
                        key={
                          cellIndex
                        }
                        className="px-5 py-4 text-gray-700"
                      >
                        {
                          cell
                        }
                      </td>
                    )
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }

  /*
   * EQUATION
   *
   * Supports:
   *
   * {
   *   expression: "E = mc^2"
   * }
   *
   * or
   *
   * {
   *   expression:
   *   "\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
   * }
   *
   * displayMode can optionally be:
   * "inline"
   */
  if (type === "equation") {
    const expression =
      data?.expression ||
      data?.latex ||
      data?.text ||
      "";

    if (!expression) {
      return null;
    }

    if (
      data?.displayMode ===
      "inline"
    ) {
      return (
        <span className="mx-1">
          <InlineMath
            math={expression}
          />
        </span>
      );
    }

    return (
      <div className="my-7 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 px-6 py-7 text-center">
        <BlockMath
          math={expression}
        />
      </div>
    );
  }

  return null;
};

export default BlockRenderer;