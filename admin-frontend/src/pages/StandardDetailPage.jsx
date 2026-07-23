import {
  useEffect,
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

import VersionForm from "../components/VersionForm";

import {
  addVersion,
  deleteVersion,
  fetchStandardById,
  updateVersion,
} from "../features/standards/standardsSlice";

const StandardDetailPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    selectedStandard,
    loading,
    saving,
    error,
  } = useSelector(
    (state) => state.standards
  );

  const [
    showVersionForm,
    setShowVersionForm,
  ] = useState(false);

  const [
    editingVersion,
    setEditingVersion,
  ] = useState(null);

  // Fetch selected standard
  useEffect(() => {
    dispatch(
      fetchStandardById(id)
    );
  }, [dispatch, id]);

  // Open form for creating version
  const openAddVersion = () => {
    setEditingVersion(null);

    setShowVersionForm(true);
  };

  // Open form for editing version
  const openEditVersion = (
    version
  ) => {
    setEditingVersion(version);

    setShowVersionForm(true);
  };

  // Close version form
  const closeVersionForm = () => {
    setShowVersionForm(false);

    setEditingVersion(null);
  };

  // Create or update version
  const handleVersionSubmit =
    async (versionData) => {
      let result;

      // UPDATE
      if (editingVersion) {
        result = await dispatch(
          updateVersion({
            standardId: id,

            versionId:
              editingVersion._id,

            versionData,
          })
        );

        if (
          updateVersion.fulfilled.match(
            result
          )
        ) {
          closeVersionForm();
        }

        return;
      }

      // CREATE
      result = await dispatch(
        addVersion({
          standardId: id,

          versionData,
        })
      );

      if (
        addVersion.fulfilled.match(
          result
        )
      ) {
        closeVersionForm();
      }
    };

  // Delete version
  const handleDeleteVersion =
    async (version) => {
      const confirmed =
        window.confirm(
          `Delete version "${version.version}"?\n\nAll sections inside this version will also be deleted.`
        );

      if (!confirmed) {
        return;
      }

      await dispatch(
        deleteVersion({
          standardId: id,

          versionId:
            version._id,
        })
      );
    };

  // Loading
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        Loading standard...
      </div>
    );
  }

  // Error
  if (
    error ||
    !selectedStandard
  ) {
    return (
      <div>
        <Link
          to="/standards"
          className="text-sm font-medium text-red-600"
        >
          ← Back to Standards
        </Link>

        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error ||
            "Standard not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}

      <Link
        to="/standards"
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        ← Back to Standards
      </Link>

      {/* Standard information */}

      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {
                  selectedStandard.title
                }
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedStandard.status ===
                  "published"
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {
                  selectedStandard.status
                }
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              {
                selectedStandard.summary
              }
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Slug: /
              {
                selectedStandard.slug
              }
            </p>
          </div>
        </div>
      </div>

      {/* Versions */}

      <div className="mt-8">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Versions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage versions and their
              structured documentation.
            </p>
          </div>

          <button
            onClick={openAddVersion}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            + Add Version
          </button>
        </div>

        {/* Version create/edit form */}

        {showVersionForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingVersion
                  ? "Edit Version"
                  : "Add Version"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {editingVersion
                  ? "Update the selected version details."
                  : "Create a new version for this standard."}
              </p>
            </div>

            <VersionForm
              initialData={
                editingVersion
              }
              onSubmit={
                handleVersionSubmit
              }
              onCancel={
                closeVersionForm
              }
              saving={saving}
            />
          </div>
        )}

        {/* No versions */}

        {selectedStandard
          .versions?.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h3 className="font-semibold text-gray-900">
              No versions yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add the first version for
              this standard.
            </p>

            <button
              onClick={openAddVersion}
              className="mt-5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            >
              + Add First Version
            </button>
          </div>
        ) : (
          /* Versions list */

          <div className="space-y-4">
            {selectedStandard.versions.map(
              (version) => (
                <div
                  key={version._id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    {/* Version information */}

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {
                            version.version
                          }
                        </h3>

                        {version.status && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              version.status ===
                              "certified"
                                ? "bg-green-50 text-green-700"
                                : version.status ===
                                    "public-consultation"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {
                              version.status
                            }
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {version.label ||
                          "No label"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {
                          version
                            .sections
                            ?.length ||
                            0
                        }{" "}
                        sections
                      </p>

                      {version.publishedDate && (
                        <p className="mt-1 text-xs text-gray-400">
                          Published:{" "}
                          {new Date(
                            version.publishedDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}

                    <div className="flex flex-wrap gap-2">
                   <Link
                        to={`/standards/${id}/versions/${version._id}`}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                        Manage Sections
                        </Link>

                      <button
                        type="button"
                        onClick={() =>
                          openEditVersion(
                            version
                          )
                        }
                        disabled={saving}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteVersion(
                            version
                          )
                        }
                        disabled={saving}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardDetailPage;