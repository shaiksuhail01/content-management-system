import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logoutAdmin,
} from "../features/auth/authSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { admin } = useSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    await dispatch(logoutAdmin());

    navigate("/login", {
      replace: true,
    });
  };

  const navigationClass = ({
    isActive,
  }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-red-50 text-red-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-gray-200 bg-white lg:block">
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="text-xl font-bold text-gray-900">
            RenewCred
            <span className="text-red-600">
              {" "}
              CMS
            </span>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          <NavLink
            to="/"
            end
            className={navigationClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/standards"
            className={navigationClass}
          >
            Standards
          </NavLink>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Content Management System
            </p>

            <p className="text-xs text-gray-500">
              Manage RenewCred website
              content
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900">
                {admin?.name ||
                  "Administrator"}
              </p>

              <p className="text-xs text-gray-500">
                {admin?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto">
            <NavLink
              to="/"
              end
              className={navigationClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/standards"
              className={navigationClass}
            >
              Standards
            </NavLink>
          </nav>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;