import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Chat must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Please provide a chat title"],
      trim: true,
      minlength: [1, "Chat title cannot be empty"],
      maxlength: [100, "Chat title cannot exceed 100 characters"],
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  },
);

// Populate user information when fetching a chat
chatSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "user",
    select: "username email",
  });
  next();
});

const chatModel = mongoose.model("chats", chatSchema);
export default chatModel;
