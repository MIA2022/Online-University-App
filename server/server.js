const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

const bodyParser=require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// routes module
app.use(require("./routes/userRoute"));
app.use(require("./routes/newsRoute"));
app.use(require("./routes/faultyRoute"));
app.use(require("./routes/studentRoute"));

// database
const dbo = require("./db/conn");

app.listen(5000, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log('Server is running on port: 5000');
});