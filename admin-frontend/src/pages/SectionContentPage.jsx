import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  fetchStandardById,
  updateSection,
} from "../features/standards/standardsSlice";

const SectionContentPage = () => {
const {
  standardId,
  versionId,
  sectionId,
} = useParams();

  const dispatch = useDispatch();

  const {
    selectedStandard,
    loading,
    saving,
    error,
  } = useSelector(
    (state) => state.standards
  );

  const [blocks, setBlocks] =
    useState([]);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [localError, setLocalError] =
    useState("");

  /*
   * Load the complete standard.
   */
  useEffect(() => {
    if (standardId) {
      dispatch(fetchStandardById(standardId));
    }
  }, [dispatch, standardId]);

  /*
   * Find current version.
   */
  const version = useMemo(() => {
    return selectedStandard?.versions?.find(
      (item) =>
        item._id === versionId
    );
  }, [
    selectedStandard,
    versionId,
  ]);

  /*
   * Find current section.
   */
  const section = useMemo(() => {
    return version?.sections?.find(
      (item) =>
        item._id === sectionId
    );
  }, [
    version,
    sectionId,
  ]);

  /*
   * Copy database blocks into local editor state.
   */
  useEffect(() => {
    if (section) {
      setBlocks(
        Array.isArray(section.blocks)
          ? section.blocks.map(
              (block) => ({
                ...block,

                data: {
                  ...(block.data || {}),
                },
              })
            )
          : []
      );
    }
  }, [section]);

  /*
   * Add a new content block.
   */
  const addBlock = (type) => {
    let data = {};

    if (type === "heading") {
      data = {
        text: "",
        level: 2,
      };
    }

    if (type === "paragraph") {
      data = {
        text: "",
      };
    }

    if (type === "list") {
      data = {
        style: "unordered",
        items: [""],
      };
    }

    if (type === "table") {
      data = {
        headers: [
          "Column 1",
          "Column 2",
        ],

        rows: [
          ["", ""],
        ],
      };
    }

    if (type === "equation") {
      data = {
        expression: "",
      };
    }

    setBlocks((previous) => [
      ...previous,

      {
        type,
        data,
        order: previous.length,
      },
    ]);

    setSaveMessage("");
    setLocalError("");
  };

  /*
   * Update a block's data.
   */
  const updateBlockData = (
    index,
    key,
    value
  ) => {
    setBlocks((previous) =>
      previous.map(
        (block, blockIndex) =>
          blockIndex === index
            ? {
                ...block,

                data: {
                  ...block.data,
                  [key]: value,
                },
              }
            : block
      )
    );

    setSaveMessage("");
  };

  /*
   * Delete block locally.
   * It is permanently removed when Save Content is clicked.
   */
  const removeBlock = (index) => {
    setBlocks((previous) =>
      previous
        .filter(
          (_, blockIndex) =>
            blockIndex !== index
        )
        .map(
          (block, blockIndex) => ({
            ...block,
            order: blockIndex,
          })
        )
    );

    setSaveMessage("");
  };

  /*
   * Move block up/down.
   */
  const moveBlock = (
    index,
    direction
  ) => {
    setBlocks((previous) => {
      const newBlocks = [
        ...previous,
      ];

      const newIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        newIndex < 0 ||
        newIndex >= newBlocks.length
      ) {
        return previous;
      }

      [
        newBlocks[index],
        newBlocks[newIndex],
      ] = [
        newBlocks[newIndex],
        newBlocks[index],
      ];

      return newBlocks.map(
        (block, blockIndex) => ({
          ...block,
          order: blockIndex,
        })
      );
    });

    setSaveMessage("");
  };

  /*
   * List helpers.
   */
  const updateListItem = (
    blockIndex,
    itemIndex,
    value
  ) => {
    const currentItems =
      blocks[blockIndex]?.data
        ?.items || [];

    const newItems = [
      ...currentItems,
    ];

    newItems[itemIndex] =
      value;

    updateBlockData(
      blockIndex,
      "items",
      newItems
    );
  };

  const addListItem = (
    blockIndex
  ) => {
    const currentItems =
      blocks[blockIndex]?.data
        ?.items || [];

    updateBlockData(
      blockIndex,
      "items",
      [...currentItems, ""]
    );
  };

  const removeListItem = (
    blockIndex,
    itemIndex
  ) => {
    const currentItems =
      blocks[blockIndex]?.data
        ?.items || [];

    updateBlockData(
      blockIndex,
      "items",
      currentItems.filter(
        (_, index) =>
          index !== itemIndex
      )
    );
  };

  /*
   * Table helpers.
   */
  const updateTableHeader = (
    blockIndex,
    headerIndex,
    value
  ) => {
    const headers = [
      ...(blocks[blockIndex]
        ?.data?.headers || []),
    ];

    headers[headerIndex] =
      value;

    updateBlockData(
      blockIndex,
      "headers",
      headers
    );
  };

  const updateTableCell = (
    blockIndex,
    rowIndex,
    cellIndex,
    value
  ) => {
    const rows = (
      blocks[blockIndex]?.data
        ?.rows || []
    ).map((row) => [...row]);

    rows[rowIndex][cellIndex] =
      value;

    updateBlockData(
      blockIndex,
      "rows",
      rows
    );
  };

  const addTableRow = (
    blockIndex
  ) => {
    const block =
      blocks[blockIndex];

    const headers =
      block.data.headers || [];

    const rows =
      block.data.rows || [];

    const newRow = Array(
      Math.max(
        headers.length,
        1
      )
    ).fill("");

    updateBlockData(
      blockIndex,
      "rows",
      [...rows, newRow]
    );
  };

  /*
   * SAVE CONTENT
   *
   * This sends exactly:
   *
   * {
   *   blocks: [
   *     {
   *       type,
   *       data,
   *       order
   *     }
   *   ]
   * }
   */
  const handleSave = async () => {
    setSaveMessage("");
    setLocalError("");

    try {
      const cleanBlocks =
        blocks.map(
          (block, index) => ({
            type: block.type,

            data:
              block.data || {},

            order: index,
          })
        );

      await dispatch(
        updateSection({
          standardId,
          versionId,
          sectionId,

          sectionData: {
            blocks: cleanBlocks,
          },
        })
      ).unwrap();

      setSaveMessage(
        "Content saved successfully."
      );

      /*
       * Fetch again from backend.
       * This verifies UI state comes from persisted MongoDB data.
       */
      await dispatch(
        fetchStandardById(standardId)
      ).unwrap();
    } catch (saveError) {
      console.error(
        "Save content failed:",
        saveError
      );

      setLocalError(
        typeof saveError ===
          "string"
          ? saveError
          : "Unable to save content."
      );
    }
  };

  if (loading && !selectedStandard) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        Loading content...
      </div>
    );
  }

  if (
    selectedStandard &&
    (!version || !section)
  ) {
    return (
      <div>
        <Link
          to={`/standards/${standardId}`}
          className="text-sm font-medium text-red-600"
        >
          ← Back to Standard
        </Link>

        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Version or section not found.
        </div>
      </div>
    );
  }

  if (!section) {
    return null;
  }

  return (
    <div>
      <Link
        to={`/standards/${standardId}/versions/${versionId}/sections`}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        ← Back to Sections
      </Link>

      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
          Content Editor
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {section.sectionNumber}{" "}
          {section.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Version:{" "}
          {version.version}
        </p>
      </div>

      {(localError || error) && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {localError || error}
        </div>
      )}

      {saveMessage && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          {saveMessage}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Add Content Block
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Build structured content using
          reusable block types.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "heading",
            "paragraph",
            "list",
            "table",
            "equation",
          ].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                addBlock(type)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium capitalize text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              + {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {blocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h3 className="font-semibold text-gray-900">
              No content blocks yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add a heading, paragraph,
              list, table or equation.
            </p>
          </div>
        ) : (
          blocks.map(
            (block, index) => (
              <div
                key={
                  block._id ||
                  `${block.type}-${index}`
                }
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-gray-600">
                      {block.type}
                    </span>

                    <span className="ml-3 text-xs text-gray-400">
                      Block {index + 1}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      onClick={() =>
                        moveBlock(
                          index,
                          "up"
                        )
                      }
                      className="rounded border border-gray-300 px-3 py-1.5 text-xs disabled:opacity-40"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        blocks.length - 1
                      }
                      onClick={() =>
                        moveBlock(
                          index,
                          "down"
                        )
                      }
                      className="rounded border border-gray-300 px-3 py-1.5 text-xs disabled:opacity-40"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeBlock(index)
                      }
                      className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {block.type ===
                  "heading" && (
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                    <select
                      value={
                        block.data
                          ?.level || 2
                      }
                      onChange={(e) =>
                        updateBlockData(
                          index,
                          "level",
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-3"
                    >
                      <option value={1}>
                        H1
                      </option>

                      <option value={2}>
                        H2
                      </option>

                      <option value={3}>
                        H3
                      </option>

                      <option value={4}>
                        H4
                      </option>
                    </select>

                    <input
                      value={
                        block.data
                          ?.text || ""
                      }
                      onChange={(e) =>
                        updateBlockData(
                          index,
                          "text",
                          e.target.value
                        )
                      }
                      placeholder="Heading text"
                      className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                    />
                  </div>
                )}

                {block.type ===
                  "paragraph" && (
                  <textarea
                    rows="6"
                    value={
                      block.data?.text ||
                      ""
                    }
                    onChange={(e) =>
                      updateBlockData(
                        index,
                        "text",
                        e.target.value
                      )
                    }
                    placeholder="Write paragraph content..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 leading-6 outline-none focus:border-red-500"
                  />
                )}

                {block.type ===
                  "list" && (
                  <div>
                    <select
                      value={
                        block.data
                          ?.style ||
                        "unordered"
                      }
                      onChange={(e) =>
                        updateBlockData(
                          index,
                          "style",
                          e.target.value
                        )
                      }
                      className="mb-4 rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <option value="unordered">
                        Bullet List
                      </option>

                      <option value="ordered">
                        Numbered List
                      </option>
                    </select>

                    <div className="space-y-3">
                      {(
                        block.data
                          ?.items || []
                      ).map(
                        (
                          item,
                          itemIndex
                        ) => (
                          <div
                            key={
                              itemIndex
                            }
                            className="flex gap-2"
                          >
                            <input
                              value={
                                item
                              }
                              onChange={(
                                e
                              ) =>
                                updateListItem(
                                  index,
                                  itemIndex,
                                  e
                                    .target
                                    .value
                                )
                              }
                              placeholder={`List item ${
                                itemIndex +
                                1
                              }`}
                              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeListItem(
                                  index,
                                  itemIndex
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 text-sm text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addListItem(
                          index
                        )
                      }
                      className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
                    >
                      + Add Item
                    </button>
                  </div>
                )}

                {block.type ===
                  "table" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {(
                            block.data
                              ?.headers ||
                            []
                          ).map(
                            (
                              header,
                              headerIndex
                            ) => (
                              <th
                                key={
                                  headerIndex
                                }
                                className="border border-gray-200 p-2"
                              >
                                <input
                                  value={
                                    header
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateTableHeader(
                                      index,
                                      headerIndex,
                                      e
                                        .target
                                        .value
                                    )
                                  }
                                  className="w-full rounded border border-gray-300 px-3 py-2 font-medium"
                                />
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {(
                          block.data
                            ?.rows || []
                        ).map(
                          (
                            row,
                            rowIndex
                          ) => (
                            <tr
                              key={
                                rowIndex
                              }
                            >
                              {row.map(
                                (
                                  cell,
                                  cellIndex
                                ) => (
                                  <td
                                    key={
                                      cellIndex
                                    }
                                    className="border border-gray-200 p-2"
                                  >
                                    <input
                                      value={
                                        cell
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateTableCell(
                                          index,
                                          rowIndex,
                                          cellIndex,
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                      className="w-full rounded border border-gray-300 px-3 py-2"
                                    />
                                  </td>
                                )
                              )}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>

                    <button
                      type="button"
                      onClick={() =>
                        addTableRow(
                          index
                        )
                      }
                      className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
                    >
                      + Add Row
                    </button>
                  </div>
                )}

                {block.type ===
                  "equation" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Mathematical
                      Expression
                    </label>

                    <input
                      value={
                        block.data
                          ?.expression ||
                        ""
                      }
                      onChange={(e) =>
                        updateBlockData(
                          index,
                          "expression",
                          e.target.value
                        )
                      }
                      placeholder="Example: E = mc^2"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono outline-none focus:border-red-500"
                    />
                  </div>
                )}
              </div>
            )
          )
        )}
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save Content"}
        </button>
      </div>
    </div>
  );
};

export default SectionContentPage;