const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BlogSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, unique: true, min: 3, max: 300 },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
