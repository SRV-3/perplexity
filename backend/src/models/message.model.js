import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Message must belong to a chat"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "ai"],
        message: 'Role must be either "user" or "ai"',
      },
      required: [true, "Please specify the role of the message"],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      minlength: [1, "Message cannot be empty"],
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  },
);

const messageModel = mongoose.model("messages", messageSchema);
export default messageModel;
