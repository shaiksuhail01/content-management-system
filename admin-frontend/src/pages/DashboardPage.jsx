import {
  Link,
} from "react-router-dom";

const DashboardPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the content displayed on
          the RenewCred public website.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Content module
          </p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Standards
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage standards, versions,
            sections and rich content.
          </p>

          <Link
            to="/standards"
            className="mt-6 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Manage Standards
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Supported content
          </p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Rich Content
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Paragraphs, lists, tables,
            equations and structured
            documentation are supported.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Publishing
          </p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Draft & Published
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Draft content remains private
            until an administrator publishes
            it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;