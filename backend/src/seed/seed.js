const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const connectDB = require("../config/db");
const Standard = require("../models/Standard");

dotenv.config();

const standards = [
  {
    title: "EV",

    slug: "ev",

    summary:
      "Lorem ipsum dolor sit amet consectetur. Gravida faucibus commodo leo eget commodo.",

    status: "published",

    order: 1,

    versions: [
      {
        version: "v1.0.0",

        label: "Certified",

        status: "certified",

        publishedDate: new Date("2025-07-12"),

        sections: [
          {
            sectionNumber: "1.0",

            title: "Introduction",

            order: 1,

            blocks: [
              {
                type: "paragraph",

                order: 1,

                data: {
                  text:
                    "Lorem ipsum dolor sit amet consectetur. Massa nec vulputate amet enim turpis elit odio fusce. Nunc cursus aliquet arcu vitae dolor ac rutrum pulvinar orci.",
                },
              },

              {
                type: "paragraph",

                order: 2,

                data: {
                  text:
                    "Tristique nulla sed at nisl justo ipsum accumsan sed a. Enim amet varius ligula egestas. Integer vestibulum non fermentum.",
                },
              },
            ],
          },

          {
            sectionNumber: "2.0",

            title: "Future Versions",

            order: 2,

            blocks: [
              {
                type: "paragraph",

                order: 1,

                data: {
                  text:
                    "Future versions of this standard will continue to evolve based on industry requirements and stakeholder feedback.",
                },
              },

              {
                type: "list",

                order: 2,

                data: {
                  style: "unordered",

                  items: [
                    "Updated eligibility requirements",
                    "Improved verification methodology",
                    "Additional reporting requirements",
                  ],
                },
              },
            ],
          },

          {
            sectionNumber: "2.1",

            title: "Future Versions",

            parentSection: "2.0",

            order: 3,

            blocks: [
              {
                type: "paragraph",

                order: 1,

                data: {
                  text:
                    "This subsection demonstrates nested structured documentation.",
                },
              },
            ],
          },

          {
            sectionNumber: "2.1.1",

            title: "Future Versions",

            parentSection: "2.1",

            order: 4,

            blocks: [
              {
                type: "equation",

                order: 1,

                data: {
                  equation: "E = mc^2",
                  displayMode: true,
                },
              },
            ],
          },

          {
            sectionNumber: "3.0",

            title: "Technical Requirements",

            order: 5,

            blocks: [
              {
                type: "table",

                order: 1,

                data: {
                  headers: ["Parameter", "Requirement"],

                  rows: [
                    ["Efficiency", "90% or greater"],
                    ["Reporting", "Annual"],
                    ["Verification", "Required"],
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },

  {
    title: "Biochar",

    slug: "biochar",

    summary:
      "A structured standard covering requirements and methodologies related to biochar projects.",

    status: "published",

    order: 2,

    versions: [],
  },

  {
    title: "Methane",

    slug: "methane",

    summary:
      "A structured standard addressing methane reduction and associated climate methodologies.",

    status: "published",

    order: 3,

    versions: [],
  },

  {
    title: "Renewable Energy",

    slug: "renewable-energy",

    summary:
      "A structured standard describing renewable energy requirements and verification approaches.",

    status: "published",

    order: 4,

    versions: [],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany();
    await Standard.deleteMany();

    // Hash admin password
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    // Create evaluation admin
    await Admin.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    // Create sample standards
    await Standard.insertMany(standards);

    console.log(
      "Admin and sample RenewCred standards seeded successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);

    process.exit(1);
  }
};

seedData();