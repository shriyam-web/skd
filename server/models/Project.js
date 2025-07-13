const mongoose = require("mongoose");

// ✅ Sub-schemas

const PricingPlanSchema = new mongoose.Schema(
  {
    title: { type: String },
    priceType: {
      type: String,
      enum: ["TOTAL", "PER_UNIT"],
      default: "TOTAL",
    },
    unit: { type: String }, // used only when priceType === "PER_UNIT"
    price: { type: Number },
    features: { type: [String], default: undefined },
    description: { type: String }, // can contain tables / markdown
  },
  { _id: false }
);

const WhyChooseUsSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
  },
  { _id: false }
);

const AdvantageSchema = new mongoose.Schema(
  {
    category: { type: String },
    points: { type: [String], default: undefined },
  },
  { _id: false }
);

const HighlightSchema = new mongoose.Schema(
  {
    heading: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const FileSchema = new mongoose.Schema(
  {
    url: { type: String },
    publicId: { type: String },
  },
  { _id: false }
);

// ✅ Main Project Schema

const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    heading: { type: String, required: true },
    location: { type: String, required: true },
    mapLocation: { type: String, default: undefined },

    usp: { type: [String], default: undefined },
    aboutContent: { type: String, default: undefined },

    ribbonTag: {
      type: String,
      enum: [
        "Hot Deal",
        "Trending",
        "New Launch",
        "Limited Time",
        "Best Seller",
        "Ready to Move",
        "Under Construction",
        "Sold Out",
        "Exclusive Offer",
        "Investor’s Choice",
        "Prime Location",
        "Budget Friendly",
        "Premium Property",
        "Upcoming Launches",
      ],
      default: undefined,
    },

    propertyType: {
      type: String,
      enum: ["Plot", "Flat", "Villa", "House", "Commercial Space"],
      required: true,
    },

    highlights: { type: [HighlightSchema], default: undefined },
    whyChooseUs: { type: [WhyChooseUsSchema], default: undefined },
    advantages: { type: [AdvantageSchema], default: undefined },
    pricingPlans: { type: [PricingPlanSchema], default: undefined },

    bannerImage: { type: FileSchema, default: undefined },
    logoImage: { type: FileSchema, default: undefined },
    aboutImage: { type: FileSchema, default: undefined },
    floorPlans: { type: [FileSchema], default: undefined },
    gallery: { type: [FileSchema], default: undefined },

    visible: { type: Boolean, default: true },
    reraNumber: { type: String, default: undefined },
    projectStatus: {
      type: String,
      enum: ["LAUNCHED", "UPCOMING", "PRE_LAUNCH", "READY_TO_MOVE"],
      default: undefined,
    },
    connectivity: { type: [String], default: undefined },
    configurationTable: { type: String, default: undefined },
    developerName: { type: String, default: undefined },
    possessionDate: { type: String, default: undefined },

    isSKDPick: {
      type: String,
      enum: ["YES", "NO"],
      default: "NO",
    },
    propertyNature: {
      type: String,
      enum: ["Residential", "Commercial", "Industrial"],
      default: "Residential",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
