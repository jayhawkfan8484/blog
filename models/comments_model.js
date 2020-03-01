const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: {
      type: String,
      default: "anonymous",
      min: 3,
      max: 30,
      trim: true
    },
    content: {
      type: String,
      min: 5,
      max: 750,
      required: true,
      trim: true
    },
    blog: { type: Schema.Types.ObjectId, ref: "Blog" }
  },
  {
    timestamps: true
  }
);

CommentSchema.statics.belongToBlog = function(blog_id) {
  console.log("in function", typeof blog_id);

  Comment.find({ blog: "5e544b87f17812415f21e51c" })
    .then(comments => {
      if (comments) {
        console.log("in if");
        comments = [...comments];
        // console.log(comments);

        return comments;
      } else {
        console.log("in else");

        return null;
      }
    })
    .catch(err => console.log(err));
};

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

// {"_id":{"$oid":"5e544b2cf17812415f21e51b"},"isPublished":false,"author":{"$oid":"5e5437000236282f9920a816"},"title":"My First Blog2","content":"This is my first blog im trying to save into database","createdAt":{"$date":{"$numberLong":"1582582572056"}},"updatedAt":{"$date":{"$numberLong":"1582582572056"}},"__v":{"$numberInt":"0"}}
