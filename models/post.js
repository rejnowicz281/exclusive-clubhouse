import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        body: { type: String, trim: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

// Virtual for post's URL
postSchema.virtual("url").get(function () {
    return "/posts/" + this._id;
});

// Virtual for post's formatted createdAt date
postSchema.virtual("createdAt_formatted").get(function () {
    return this.createdAt.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});

// Virtual for post's formatted updatedAt date
postSchema.virtual("updatedAt_formatted").get(function () {
    return this.updatedAt.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
});

export default mongoose.model("Post", postSchema);
