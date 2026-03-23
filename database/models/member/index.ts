import mongoose from "mongoose";

export namespace MemberDatabase {
  const schema = new mongoose.Schema(
    {
      familyId: {
        type: String,
        ref: "families",
      },
      name: {
        first: String,
        middle: String,
        last: String,
      },
      fatherName: String,
      birthDate: String,
      birthTime: String,
      birthPlace: String,
      gender: String,
      phone: String,
      email: String,
      address: String,
      note: [{
        title: String,
        value:String  
      }],
      extra: {
        day: String,
        thiti: String,
        paksha: String,
        gana: String,
        lagna: String,
        rashi: String,
        rashiDev: String,
        nakshatra: String,
      },
      chart: {
        lagan: {
          house1: String,
          house2: String,
          house3: String,
          house4: String,
          house5: String,
          house6: String,
          house7: String,
          house8: String,
          house9: String,
          house10: String,
          house11: String,
          house12: String,
        },
        chandra: {
          house1: String,
          house2: String,
          house3: String,
          house4: String,
          house5: String,
          house6: String,
          house7: String,
          house8: String,
          house9: String,
          house10: String,
          house11: String,
          house12: String,
        },
      },
    },
    {
      timestamps: true,
      id: false,
      versionKey: false,
    }
  );

  export const model = mongoose.model("members", schema);
}
