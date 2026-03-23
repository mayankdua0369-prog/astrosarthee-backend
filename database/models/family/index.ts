import mongoose from "mongoose";

export namespace FamilyDatabase {
    const schema = new mongoose.Schema({
        name: String,
        city: String,
        state: String,
        note:String
    }, {
        timestamps: true,
        id: false,
        versionKey:false
    })

    schema.virtual("members", {
        ref: "members",
        localField: "_id",
        foreignField: "familyId",
      });
      
      schema.set("toObject", { virtuals: true });
      schema.set("toJSON", { virtuals: true });

    export const model = mongoose.model("families", schema)
}
