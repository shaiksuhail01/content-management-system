import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

// GET ALL STANDARDS
export const fetchStandards = createAsyncThunk(
  "standards/fetchStandards",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/standards"
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to load standards"
      );
    }
  }
);

// GET ONE STANDARD
export const fetchStandardById =
  createAsyncThunk(
    "standards/fetchStandardById",

    async (id, { rejectWithValue }) => {
      try {
        const response =
          await axiosInstance.get(
            `/admin/standards/${id}`
          );

        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to load standard"
        );
      }
    }
  );

// CREATE STANDARD
export const createStandard =
  createAsyncThunk(
    "standards/createStandard",

    async (standardData, {
      rejectWithValue,
    }) => {
      try {
        const response =
          await axiosInstance.post(
            "/admin/standards",
            standardData
          );

        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to create standard"
        );
      }
    }
  );

// UPDATE STANDARD
export const updateStandard =
  createAsyncThunk(
    "standards/updateStandard",

    async (
      {
        id,
        standardData,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axiosInstance.put(
            `/admin/standards/${id}`,
            standardData
          );

        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to update standard"
        );
      }
    }
  );

// DELETE STANDARD
export const deleteStandard =
  createAsyncThunk(
    "standards/deleteStandard",

    async (id, { rejectWithValue }) => {
      try {
        await axiosInstance.delete(
          `/admin/standards/${id}`
        );

        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to delete standard"
        );
      }
    }
  );

  export const addVersion =
  createAsyncThunk(
    "standards/addVersion",

    async (
      {
        standardId,
        versionData,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axiosInstance.post(
            `/admin/standards/${standardId}/versions`,
            versionData
          );

        return {
          standardId,
          version:
            response.data.data,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to add version"
        );
      }
    }
  );

export const updateVersion =
  createAsyncThunk(
    "standards/updateVersion",

    async (
      {
        standardId,
        versionId,
        versionData,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axiosInstance.put(
            `/admin/standards/${standardId}/versions/${versionId}`,
            versionData
          );

        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to update version"
        );
      }
    }
  );

export const deleteVersion =
  createAsyncThunk(
    "standards/deleteVersion",

    async (
      {
        standardId,
        versionId,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        await axiosInstance.delete(
          `/admin/standards/${standardId}/versions/${versionId}`
        );

        return versionId;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to delete version"
        );
      }
    }
  );

  // CREATE SECTION
export const addSection =
  createAsyncThunk(
    "standards/addSection",

    async (
      {
        standardId,
        versionId,
        sectionData,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axiosInstance.post(
            `/admin/standards/${standardId}/versions/${versionId}/sections`,
            sectionData
          );

        return {
          versionId,

          section:
            response.data.data,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to add section"
        );
      }
    }
  );


// UPDATE SECTION
export const updateSection =
  createAsyncThunk(
    "standards/updateSection",

    async (
      {
        standardId,
        versionId,
        sectionId,
        sectionData,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axiosInstance.put(
            `/admin/standards/${standardId}/versions/${versionId}/sections/${sectionId}`,
            sectionData
          );

        return {
          versionId,

          section:
            response.data.data,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to update section"
        );
      }
    }
  );


// DELETE SECTION
export const deleteSection =
  createAsyncThunk(
    "standards/deleteSection",

    async (
      {
        standardId,
        versionId,
        sectionId,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        await axiosInstance.delete(
          `/admin/standards/${standardId}/versions/${versionId}/sections/${sectionId}`
        );

        return {
          versionId,
          sectionId,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to delete section"
        );
      }
    }
  );

const standardsSlice = createSlice({
  name: "standards",

  initialState: {
    items: [],
    selectedStandard: null,

    loading: false,
    saving: false,

    error: null,
  },

  reducers: {
    clearSelectedStandard: (state) => {
      state.selectedStandard = null;
    },

    clearStandardsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH ALL
      .addCase(
        fetchStandards.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStandards.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      .addCase(
        fetchStandards.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // FETCH ONE
      .addCase(
        fetchStandardById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStandardById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedStandard =
            action.payload;
        }
      )

      .addCase(
        fetchStandardById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // CREATE
      .addCase(
        createStandard.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        createStandard.fulfilled,
        (state, action) => {
          state.saving = false;

          state.items.push(
            action.payload
          );
        }
      )

      .addCase(
        createStandard.rejected,
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      )

      // UPDATE
      .addCase(
        updateStandard.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        updateStandard.fulfilled,
        (state, action) => {
          state.saving = false;

          const index =
            state.items.findIndex(
              (item) =>
                item._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.items[index] =
              action.payload;
          }

          state.selectedStandard =
            action.payload;
        }
      )

      .addCase(
        updateStandard.rejected,
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      )

      // DELETE
      .addCase(
        deleteStandard.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        deleteStandard.fulfilled,
        (state, action) => {
          state.saving = false;

          state.items =
            state.items.filter(
              (item) =>
                item._id !==
                action.payload
            );
        }
      )

      .addCase(
        deleteStandard.rejected,
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      )

            // ADD VERSION
      .addCase(
        addVersion.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        addVersion.fulfilled,
        (state, action) => {
          state.saving = false;

          if (
            state.selectedStandard
          ) {
            state.selectedStandard
              .versions.push(
                action.payload.version
              );
          }
        }
      )

      .addCase(
        addVersion.rejected,
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      )

      // UPDATE VERSION
      .addCase(
        updateVersion.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        updateVersion.fulfilled,
        (state, action) => {
          state.saving = false;

          const index =
            state.selectedStandard
              ?.versions.findIndex(
                (version) =>
                  version._id ===
                  action.payload._id
              );

          if (
            index !== undefined &&
            index !== -1
          ) {
            state.selectedStandard
              .versions[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateVersion.rejected,
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      )

      // DELETE VERSION
      .addCase(
        deleteVersion.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        deleteVersion.fulfilled,
        (state, action) => {
          state.saving = false;

          if (
            state.selectedStandard
          ) {
            state.selectedStandard
              .versions =
              state.selectedStandard
                .versions.filter(
                  (version) =>
                    version._id !==
                    action.payload
                );
          }
        }
      )

      .addCase(
        deleteVersion.rejected,
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      )
            // ADD SECTION

      .addCase(
        addSection.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        addSection.fulfilled,
        (state, action) => {
          state.saving = false;

          const version =
            state.selectedStandard
              ?.versions.find(
                (item) =>
                  item._id ===
                  action.payload.versionId
              );

          if (version) {
            if (!version.sections) {
              version.sections = [];
            }

            version.sections.push(
              action.payload.section
            );
          }
        }
      )

      .addCase(
        addSection.rejected,
        (state, action) => {
          state.saving = false;

          state.error =
            action.payload;
        }
      )


      // UPDATE SECTION

      .addCase(
        updateSection.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        updateSection.fulfilled,
        (state, action) => {
          state.saving = false;

          const version =
            state.selectedStandard
              ?.versions.find(
                (item) =>
                  item._id ===
                  action.payload.versionId
              );

          if (version) {
            const sectionIndex =
              version.sections.findIndex(
                (section) =>
                  section._id ===
                  action.payload.section._id
              );

            if (
              sectionIndex !== -1
            ) {
              version.sections[
                sectionIndex
              ] =
                action.payload.section;
            }
          }
        }
      )

      .addCase(
        updateSection.rejected,
        (state, action) => {
          state.saving = false;

          state.error =
            action.payload;
        }
      )


      // DELETE SECTION

      .addCase(
        deleteSection.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        deleteSection.fulfilled,
        (state, action) => {
          state.saving = false;

          const version =
            state.selectedStandard
              ?.versions.find(
                (item) =>
                  item._id ===
                  action.payload.versionId
              );

          if (version) {
            version.sections =
              version.sections.filter(
                (section) =>
                  section._id !==
                  action.payload.sectionId
              );
          }
        }
      )

      .addCase(
        deleteSection.rejected,
        (state, action) => {
          state.saving = false;

          state.error =
            action.payload;
        }
      );
      
  },
});

export const {
  clearSelectedStandard,
  clearStandardsError,
} = standardsSlice.actions;

export default standardsSlice.reducer;