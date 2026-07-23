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
} from "react-router-dom";

import StandardForm from "../components/StandardForm";

import {
  createStandard,
  deleteStandard,
  fetchStandards,
  updateStandard,
} from "../features/standards/standardsSlice";

const StandardsPage = () => {
  const dispatch = useDispatch();

  const {
    items,
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
    editingStandard,
    setEditingStandard,
  ] = useState(null);

  useEffect(() => {
    dispatch(fetchStandards());
  }, [dispatch]);

  const openCreateForm = () => {
    setEditingStandard(null);
    setShowForm(true);
  };

  const openEditForm = (
    standard
  ) => {
    setEditingStandard(standard);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingStandard(null);
  };

  const handleSubmit = async (
    formData
  ) => {
    let result;

    if (editingStandard) {
      result = await dispatch(
        updateStandard({
          id: editingStandard._id,
          standardData: formData,
        })
      );

      if (
        updateStandard.fulfilled.match(
          result
        )
      ) {
        closeForm();
      }

      return;
    }

    result = await dispatch(
      createStandard(formData)
    );

    if (
      createStandard.fulfilled.match(
        result
      )
    ) {
      closeForm();
    }
  };

  const handleDelete = async (
    standard
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${standard.title}"?\n\nThis will also delete its versions, sections and content.`
      );

    if (!confirmed) {
      return;
    }

    await dispatch(
      deleteStandard(standard._id)
    );
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Standards
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage standards displayed on
            the RenewCred public website.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
        >
          + Add Standard
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingStandard
                ? "Edit Standard"
                : "Create Standard"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingStandard
                ? "Update the standard details and publishing status."
                : "Create a new standard. You can add versions and sections after creation."}
            </p>
          </div>

          <StandardForm
            initialData={
              editingStandard
            }
            onSubmit={handleSubmit}
            onCancel={closeForm}
            saving={saving}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading standards...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="font-semibold text-gray-900">
              No standards found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first standard
              to begin managing content.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Standard
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Versions
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map(
                  (standard) => (
                    <tr
                      key={
                        standard._id
                      }
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {
                            standard.title
                          }
                        </p>

                        <p className="mt-1 max-w-md truncate text-sm text-gray-500">
                          {
                            standard.summary
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          /
                          {
                            standard.slug
                          }
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            standard.status ===
                            "published"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {
                            standard.status
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {
                          standard
                            .versions
                            ?.length ||
                            0
                        }
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {
                          standard.order
                        }
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/standards/${standard._id}`}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Manage
                          </Link>

                          <button
                            onClick={() =>
                              openEditForm(
                                standard
                              )
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                standard
                              )
                            }
                            disabled={
                              saving
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardsPage;