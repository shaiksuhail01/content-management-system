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

import SectionForm from "../components/SectionForm";

import {
  addSection,
  deleteSection,
  fetchStandardById,
  updateSection,
} from "../features/standards/standardsSlice";

const VersionSectionsPage = () => {
  const {
    standardId,
    versionId,
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

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingSection,
    setEditingSection,
  ] = useState(null);

  useEffect(() => {
    dispatch(
      fetchStandardById(
        standardId
      )
    );
  }, [
    dispatch,
    standardId,
  ]);

  const version =
    selectedStandard?.versions?.find(
      (item) =>
        item._id === versionId
    );

  const openAddSection = () => {
    setEditingSection(null);

    setShowForm(true);
  };

  const openEditSection = (
    section
  ) => {
    setEditingSection(section);

    setShowForm(true);
  };

  const closeForm = () => {
    setEditingSection(null);

    setShowForm(false);
  };

  const handleSubmit =
    async (sectionData) => {
      let result;

      if (editingSection) {
        result = await dispatch(
          updateSection({
            standardId,

            versionId,

            sectionId:
              editingSection._id,

            sectionData,
          })
        );

        if (
          updateSection.fulfilled.match(
            result
          )
        ) {
          closeForm();
        }

        return;
      }

      result = await dispatch(
        addSection({
          standardId,

          versionId,

          sectionData,
        })
      );

      if (
        addSection.fulfilled.match(
          result
        )
      ) {
        closeForm();
      }
    };

  const handleDelete =
    async (section) => {
      const confirmed =
        window.confirm(
          `Delete section "${section.sectionNumber} ${section.title}"?\n\nAll content blocks inside this section will also be deleted.`
        );

      if (!confirmed) {
        return;
      }

      await dispatch(
        deleteSection({
          standardId,

          versionId,

          sectionId:
            section._id,
        })
      );
    };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
        Loading sections...
      </div>
    );
  }

  if (
    error ||
    !selectedStandard ||
    !version
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
          {error ||
            "Version not found"}
        </div>
      </div>
    );
  }

  const sections =
    [...(version.sections || [])]
      .sort(
        (a, b) =>
          (a.order || 0) -
          (b.order || 0)
      );

  return (
    <div>
      <Link
        to={`/standards/${standardId}`}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        ← Back to{" "}
        {selectedStandard.title}
      </Link>

      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-red-600">
          {
            selectedStandard.title
          }
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {version.version}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {version.label ||
            "No version label"}
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Sections
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage structured
              documentation for this
              version.
            </p>
          </div>

          <button
            onClick={
              openAddSection
            }
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            + Add Section
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-gray-900">
              {editingSection
                ? "Edit Section"
                : "Add Section"}
            </h3>

            <SectionForm
              initialData={
                editingSection
              }
              onSubmit={
                handleSubmit
              }
              onCancel={
                closeForm
              }
              saving={saving}
            />
          </div>
        )}

        {sections.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h3 className="font-semibold text-gray-900">
              No sections yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add the first structured
              section to this version.
            </p>

            <button
              onClick={
                openAddSection
              }
              className="mt-5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              + Add First Section
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map(
              (section) => (
                <div
                  key={
                    section._id
                  }
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {
                          section.sectionNumber
                        }{" "}
                        {
                          section.title
                        }
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          section
                            .blocks
                            ?.length ||
                            0
                        }{" "}
                        content blocks
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/standards/${standardId}/versions/${versionId}/sections/${section._id}`}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Manage Content
                      </Link>

                      <button
                        onClick={() =>
                          openEditSection(
                            section
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            section
                          )
                        }
                        disabled={saving}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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

export default VersionSectionsPage;