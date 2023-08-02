import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    is_admin: {
        type: Boolean,
        default: false,
    },
    is_member: {
        type: Boolean,
        default: false,
    },
});

// Virtual for user's URL
userSchema.virtual("url").get(function () {
    return "/users/" + this._id;
});

// Virtual for user's identifier
userSchema.virtual("identifier").get(function () {
    if (this.first_name && this.last_name) return this.first_name + " " + this.last_name;
    else if (this.first_name) return this.first_name;
    else if (this.last_name) return this.last_name;
    else return this.email;
});

export default mongoose.model("User", userSchema);
