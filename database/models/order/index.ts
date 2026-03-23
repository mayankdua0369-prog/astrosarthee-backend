import mongoose from "mongoose";

export namespace OrderDatabase {
  const schema = new mongoose.Schema(
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "members",
      },
      familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "families",
      },
      orders: {
        type: [
          {
            itemName: String,
            price: Number,
            qty: Number,
            unit:String
          },
        ],
        default: [],
      },
      paymentHistory: {
        type: [
          {
            amount: { type: Number },
            type: { type: String },
            paymentMode: { type: String },
            note: { type: String, default: "" },
            date: { type: String },
          },
        ],
        default: [],
      },
    },
    {
      id: false,
      versionKey: false,
      timestamps: true,
    }
  );
  export const model = mongoose.model("orders", schema);
}
