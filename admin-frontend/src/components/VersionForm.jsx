import {
  useEffect,
  useState,
} from "react";

const emptyForm = {
  version: "",
  label: "",
  status: "draft",
  startDate: "",
  endDate: "",
  publishedDate: "",
};

const VersionForm = ({
  initialData,
  onSubmit,
  onCancel,
  saving,
}) => {
  const [
    formData,
    setFormData,
  ] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        version:
          initialData.version || "",

        label:
          initialData.label || "",

        status:
          initialData.status ||
          "draft",

        startDate:
          initialData.startDate
            ? initialData.startDate.slice(
                0,
                10
              )
            : "",

        endDate:
          initialData.endDate
            ? initialData.endDate.slice(
                0,
                10
              )
            : "",

        publishedDate:
          initialData.publishedDate
            ? initialData.publishedDate.slice(
                0,
                10
              )
            : "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    onSubmit({
      ...formData,

      startDate:
        formData.startDate || null,

      endDate:
        formData.endDate || null,

      publishedDate:
        formData.publishedDate ||
        null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Version *
          </label>

          <input
            name="version"
            value={formData.version}
            onChange={handleChange}
            required
            placeholder="v1.0.0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Label
          </label>

          <input
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="Certified"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
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
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
        >
          <option value="draft">
            Draft
          </option>

          <option value="public-consultation">
            Public consultation
          </option>

          <option value="certified">
            Certified
          </option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Start date
          </label>

          <input
            type="date"
            name="startDate"
            value={
              formData.startDate
            }
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            End date
          </label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Published date
          </label>

          <input
            type="date"
            name="publishedDate"
            value={
              formData.publishedDate
            }
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700"
        >
          Cancel
        </button>

        <button
          disabled={saving}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : initialData
              ? "Save Version"
              : "Add Version"}
        </button>
      </div>
    </form>
  );
};

export default VersionForm;