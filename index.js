const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
mongoose.connect("mongodb://localhost:27017/firstnode", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const Employe = mongoose.model("Employe", {
  id: Number,
  name: String,
  age: Number,
  dob: Date,
  dept_id: Number,
});

const Department = mongoose.model("Department", {
  dept_id: Number,
  name: String,
  desc: String,
});
Employe.aggregate([{
    $lookup: {
    From: "Department",
    LocalField: "dept_id",
    foreignField: "dept_id",
    as: "Employee_Details"
    }}]);

app.post("/sendemp", async (req, res) => {
  const body = req.body;
  console.log("req.body", body);
  try {
    const employe = new Employe(body);

    const result = await employe.save();
    res.send({
      message: "Employee data saved successfully",
    });
    console.log("result", result);
  } catch (ex) {
    console.log("ex", ex);
    res.send({ message: "Error" }).status(401);
  }
});
app.post("/senddept", async (req, res) => {
  const body = req.body;
  console.log("req.body", body);
  try {
    const depart = new Department(body);

    const result = await depart.save();
    res.send({
      message: "Department data saved successfully",
    });
    console.log("result", result);
  } catch (ex) {
    console.log("ex", ex);
    res.send({ message: "Error" }).status(401);
  }
});
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("Express application running on localhost:3000");
});
