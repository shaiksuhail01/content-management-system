import {
  useEffect,
  useState,
} from "react";

const initialForm = {
  title: "",
  slug: "",
  summary: "",
  icon: "",
  status: "draft",
  order: 0,
};

const StandardForm = ({
  initialData,
  onSubmit,
  onCancel,
  saving,
}) => {
  const [
    formData,
    setFormData,
  ] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title:
          initialData.title || "",

        slug:
          initialData.slug || "",

        summary:
          initialData.summary || "",

        icon:
          initialData.icon || "",

        status:
          initialData.status ||
          "draft",

        order:
          initialData.order ?? 0,
      });
    } else {
      setFormData(initialForm);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        name === "order"
          ? Number(value)
          : value,
    }));
  };

  const handleTitleChange = (
    event
  ) => {
    const title = event.target.value;

    setFormData((previous) => ({
      ...previous,

      title,

      slug: initialData
        ? previous.slug
        : title
            .toLowerCase()
            .trim()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            ),
    }));
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Title *
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleTitleChange}
          required
          placeholder="Example: EV"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Slug *
        </label>

        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          placeholder="ev"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />

        <p className="mt-1 text-xs text-gray-500">
          Used in the public URL.
          Example: /standards/ev
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Summary *
        </label>

        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Short description of the standard"
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Icon
          </label>

          <input
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="Optional icon"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Display order
          </label>

          <input
            name="order"
            type="number"
            min="0"
            value={formData.order}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
        >
          <option value="draft">
            Draft
          </option>

          <option value="published">
            Published
          </option>
        </select>

        <p className="mt-1 text-xs text-gray-500">
          Draft standards are not
          displayed on the public website.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
              ? "Save Changes"
              : "Create Standard"}
        </button>
      </div>
    </form>
  );
};

export default StandardForm;