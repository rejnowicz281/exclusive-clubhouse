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

export default mongoose.model("Post", postSchema);
