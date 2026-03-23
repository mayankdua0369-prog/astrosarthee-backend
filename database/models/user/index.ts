import mongoose from "mongoose";

export namespace UserDatabase {
  const schema = new mongoose.Schema(
    {
      username: {
        type: String,
        default:"admin"
      },
      password: {
        type: String,
        default:"singh#123"
      },
    },
    {
      timestamps: true,
      versionKey: false,
      id: false,
    }
  );
  export const model = mongoose.model("users", schema);
}
