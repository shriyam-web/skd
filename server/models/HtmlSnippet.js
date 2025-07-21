const mongoose = require("mongoose");

const htmlSnippetSchema = new mongoose.Schema(
  {
    htmlCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HtmlSnippet", htmlSnippetSchema);
