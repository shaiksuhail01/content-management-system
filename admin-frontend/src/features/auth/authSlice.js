import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

const storedToken =
  localStorage.getItem("adminToken");

const storedAdmin =
  localStorage.getItem("adminUser");

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",

  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        credentials
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to login"
      );
    }
  }
);

export const fetchCurrentAdmin =
  createAsyncThunk(
    "auth/fetchCurrentAdmin",

    async (_, { rejectWithValue }) => {
      try {
        const response =
          await axiosInstance.get("/auth/me");

        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Session expired"
        );
      }
    }
  );

export const logoutAdmin =
  createAsyncThunk(
    "auth/logoutAdmin",

    async (_, { rejectWithValue }) => {
      try {
        await axiosInstance.post(
          "/auth/logout"
        );

        return true;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to logout"
        );
      }
    }
  );

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: storedToken || null,

    admin: storedAdmin
      ? JSON.parse(storedAdmin)
      : null,

    loading: false,

    error: null,
  },

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    clearSession: (state) => {
      state.token = null;
      state.admin = null;
      state.error = null;

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    },
  },

  extraReducers: (builder) => {
    builder

      // Login
      .addCase(
        loginAdmin.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginAdmin.fulfilled,
        (state, action) => {
          state.loading = false;

          state.token =
            action.payload.token;

          state.admin =
            action.payload.admin;

          localStorage.setItem(
            "adminToken",
            action.payload.token
          );

          localStorage.setItem(
            "adminUser",
            JSON.stringify(
              action.payload.admin
            )
          );
        }
      )

      .addCase(
        loginAdmin.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Unable to login";
        }
      )

      // Current admin
      .addCase(
        fetchCurrentAdmin.fulfilled,
        (state, action) => {
          state.admin = action.payload;

          localStorage.setItem(
            "adminUser",
            JSON.stringify(action.payload)
          );
        }
      )

      .addCase(
        fetchCurrentAdmin.rejected,
        (state) => {
          state.token = null;
          state.admin = null;

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminUser"
          );
        }
      )

      // Logout
      .addCase(
        logoutAdmin.fulfilled,
        (state) => {
          state.token = null;
          state.admin = null;

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminUser"
          );
        }
      )

      .addCase(
        logoutAdmin.rejected,
        (state) => {
          // Even if backend logout fails,
          // clear the local stateless JWT session.
          state.token = null;
          state.admin = null;

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminUser"
          );
        }
      );
  },
});

export const {
  clearAuthError,
  clearSession,
} = authSlice.actions;

export default authSlice.reducer;