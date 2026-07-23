import {
  useEffect,
  useState,
} from "react";

const emptyForm = {
  sectionNumber: "",
  title: "",
  parentSection: "",
  order: 0,
  blocks: [],
};

const SectionForm = ({
  initialData,
  onSubmit,
  onCancel,
  saving,
}) => {
  const [formData, setFormData] =
    useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sectionNumber:
          initialData.sectionNumber || "",

        title:
          initialData.title || "",

        parentSection:
          initialData.parentSection || "",

        order:
          initialData.order ?? 0,

        blocks:
          initialData.blocks || [],
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        name === "order"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formData,

      parentSection:
        formData.parentSection.trim() ||
        null,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Section Number *
          </label>

          <input
            name="sectionNumber"
            value={
              formData.sectionNumber
            }
            onChange={handleChange}
            required
            placeholder="1.0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Display Order
          </label>

          <input
            name="order"
            type="number"
            min="0"
            value={formData.order}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Section Title *
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Introduction"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Parent Section
        </label>

        <input
          name="parentSection"
          value={
            formData.parentSection
          }
          onChange={handleChange}
          placeholder="Optional, e.g. 2.1"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
        />

        <p className="mt-1 text-xs text-gray-500">
          Leave empty for a top-level
          section.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : initialData
              ? "Save Section"
              : "Add Section"}
        </button>
      </div>
    </form>
  );
};

export default SectionForm;