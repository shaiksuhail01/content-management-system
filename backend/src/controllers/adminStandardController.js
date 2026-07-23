const Standard = require("../models/Standard");

// GET all standards
const getAdminStandards = async (req, res, next) => {
  try {
    const standards = await Standard.find()
      .select("title slug summary icon status order versions createdAt updatedAt")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: standards.length,
      data: standards,
    });
  } catch (error) {
    next(error);
  }
};

// GET single standard
const getAdminStandardById = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    res.status(200).json({
      success: true,
      data: standard,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE standard
const createStandard = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      summary,
      icon,
      status,
      order,
    } = req.body;

    const existingStandard = await Standard.findOne({
      slug: slug.toLowerCase(),
    });

    if (existingStandard) {
      return res.status(409).json({
        success: false,
        message: "A standard with this slug already exists",
      });
    }

    const standard = await Standard.create({
      title,
      slug: slug.toLowerCase(),
      summary,
      icon: icon || "",
      status: status || "draft",
      order: order || 0,
      versions: [],
    });

    res.status(201).json({
      success: true,
      message: "Standard created successfully",
      data: standard,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE standard
const updateStandard = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    const {
      title,
      slug,
      summary,
      icon,
      status,
      order,
    } = req.body;

    if (slug && slug !== standard.slug) {
      const existingStandard = await Standard.findOne({
        slug: slug.toLowerCase(),
        _id: { $ne: standard._id },
      });

      if (existingStandard) {
        return res.status(409).json({
          success: false,
          message: "A standard with this slug already exists",
        });
      }
    }

    if (title !== undefined) standard.title = title;
    if (slug !== undefined) standard.slug = slug.toLowerCase();
    if (summary !== undefined) standard.summary = summary;
    if (icon !== undefined) standard.icon = icon;
    if (status !== undefined) standard.status = status;
    if (order !== undefined) standard.order = order;

    await standard.save();

    res.status(200).json({
      success: true,
      message: "Standard updated successfully",
      data: standard,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE standard
const deleteStandard = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    await standard.deleteOne();

    res.status(200).json({
      success: true,
      message: "Standard deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ADD version
const addVersion = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    const {
      version,
      label,
      status,
      startDate,
      endDate,
      publishedDate,
    } = req.body;

    const versionExists = standard.versions.some(
      (item) => item.version === version
    );

    if (versionExists) {
      return res.status(409).json({
        success: false,
        message: "This version already exists",
      });
    }

    standard.versions.push({
      version,
      label: label || "",
      status: status || "draft",
      startDate: startDate || null,
      endDate: endDate || null,
      publishedDate: publishedDate || null,
      sections: [],
    });

    await standard.save();

    const createdVersion =
      standard.versions[standard.versions.length - 1];

    res.status(201).json({
      success: true,
      message: "Version added successfully",
      data: createdVersion,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE version
const updateVersion = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    const version = standard.versions.id(
      req.params.versionId
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    const {
      version: versionName,
      label,
      status,
      startDate,
      endDate,
      publishedDate,
    } = req.body;

    if (versionName !== undefined) {
      version.version = versionName;
    }

    if (label !== undefined) {
      version.label = label;
    }

    if (status !== undefined) {
      version.status = status;
    }

    if (startDate !== undefined) {
      version.startDate = startDate || null;
    }

    if (endDate !== undefined) {
      version.endDate = endDate || null;
    }

    if (publishedDate !== undefined) {
      version.publishedDate = publishedDate || null;
    }

    await standard.save();

    res.status(200).json({
      success: true,
      message: "Version updated successfully",
      data: version,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE version
const deleteVersion = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    const version = standard.versions.id(
      req.params.versionId
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    version.deleteOne();

    await standard.save();

    res.status(200).json({
      success: true,
      message: "Version deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ADD section
const addSection = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    const version = standard.versions.id(
      req.params.versionId
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    const {
      sectionNumber,
      title,
      parentSection,
      order,
      blocks,
    } = req.body;

    const sectionExists = version.sections.some(
      (section) =>
        section.sectionNumber === sectionNumber
    );

    if (sectionExists) {
      return res.status(409).json({
        success: false,
        message:
          "A section with this section number already exists",
      });
    }

    version.sections.push({
      sectionNumber,
      title,
      parentSection: parentSection || null,
      order: order || 0,
      blocks: blocks || [],
    });

    await standard.save();

    const createdSection =
      version.sections[version.sections.length - 1];

    res.status(201).json({
      success: true,
      message: "Section added successfully",
      data: createdSection,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE section
const updateSection = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    const version = standard.versions.id(
      req.params.versionId
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    const section = version.sections.id(
      req.params.sectionId
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const {
      sectionNumber,
      title,
      parentSection,
      order,
      blocks,
    } = req.body;

    if (sectionNumber !== undefined) {
      section.sectionNumber = sectionNumber;
    }

    if (title !== undefined) {
      section.title = title;
    }

    if (parentSection !== undefined) {
      section.parentSection =
        parentSection || null;
    }

    if (order !== undefined) {
      section.order = order;
    }

    if (blocks !== undefined) {
      section.blocks = blocks;
    }

    await standard.save();

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE section
const deleteSection = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    const version = standard.versions.id(
      req.params.versionId
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    const section = version.sections.id(
      req.params.sectionId
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    section.deleteOne();

    await standard.save();

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStandards,
  getAdminStandardById,
  createStandard,
  updateStandard,
  deleteStandard,
   addVersion,
  updateVersion,
  deleteVersion,
    addSection,
  updateSection,
  deleteSection,
};