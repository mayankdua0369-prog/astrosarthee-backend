import mongoose from "mongoose";

export namespace LeadsDatabase {
    const schema = new mongoose.Schema({
        name: String,
        mobile:String,
        note:String
    }, {
        timestamps: true,
        id: false,
        versionKey:false
    })


    export const model = mongoose.model("leads", schema)
}
