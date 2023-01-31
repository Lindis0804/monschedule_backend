const mongoose = require("mongoose");
const User = require("./userModel");
const { Schema, SchemaTypes, model } = mongoose;
const activitySchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required:true
    },
    activity: {
      type: String,
      required: true,
    },
  },
  {
    collection: "activities",
    timestamps: true,
    expireAfterSeconds: 604800,
  }
);
const Activity = model("Activity", activitySchema);
// User.find({}, "_id").then((data) => {
//     console.log("data ",data)
//   for (var i = 0; i < data.length; i++) {
//     Activity.create({
//       user: data[i],
//       activity: ` just added activity ${i + 1}`,
//     });
//   }
//   for (var i = 0; i < data.length; i++) {
//     Activity.create({
//       user: data[i],
//       activity: ` just finished task ${i + 1}`,
//     });
//   }
//   for (var i = 0; i < data.length; i++) {
//     Activity.create({
//       user: data[i],
//       activity: ` just finished project ${i + 1}`,
//     });
//   }
// });
Activity.updateMany(
  {},
  {
    $rename: { "user": "userId" },
  },
  {
    multi: true,
  },
  (err, blocks) => {
    console.log("Done!");
  }
);
module.exports = Activity;
