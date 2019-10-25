const mongoose = require("mongoose");
// const config = require("config");
// const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Huda01:huda1@devconnector-yol6p.mongodb.net/test?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    );

    console.log("DB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
