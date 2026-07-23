const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "paragraph", "list", "table", "equation"],
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: true,
  }
);

const SectionSchema = new mongoose.Schema(
  {
    sectionNumber: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    parentSection: {
      type: String,
      default: null,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
    },

    blocks: {
      type: [BlockSchema],
      default: [],
    },
  },
  {
    _id: true,
  }
);

const VersionSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "public-consultation", "certified"],
      default: "draft",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    publishedDate: {
      type: Date,
      default: null,
    },

    sections: {
      type: [SectionSchema],
      default: [],
    },
  },
  {
    _id: true,
  }
);

const StandardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    order: {
      type: Number,
      default: 0,
    },

    versions: {
      type: [VersionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Standard", StandardSchema);