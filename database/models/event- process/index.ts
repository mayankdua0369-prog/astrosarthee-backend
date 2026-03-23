import mongoose from "mongoose";

export namespace EventProcessDatabase {
  const schema = new mongoose.Schema(
    {
      eventId: {
        type: String,
        required: true,
        unique: true,
      },
      processedAt: {
        type: Date,
        default: Date.now,
        expires: 86400, 
      },
    },
    {
      timestamps: true,
      id: false,
      versionKey: false,
    }
  );
  export const model = mongoose.model("eventprocesses", schema);
}
