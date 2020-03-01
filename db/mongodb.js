const mongoose = require("mongoose");

const mongoDb = process.env.MONGODB_URI;

mongoose.connect(mongoDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
db.on("connected", () => console.log("DB Connected"));
