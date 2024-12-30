//npm run start
//npm install express
// npm install -D nodemon           developer dependency for auto restart server after update
// npm i dotenv
//npm install winston morgan

////api keys etc
// require("dotenv").config();

import logger from "./logger.js";
import morgan from "morgan";

import "dotenv/config";
import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

//morgan
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

// add a new tea
app.post("/teas", (req, res) => {
  // logger.info("A post request is made to add a new tea");
  // logger.warn("A post request is made to add a new tea");
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

// get all teas
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

// get a tea with id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("tea not found");
  }
  return res.status(200).send(tea);
});

app.get("/", (req, res) => {
  res.send("hello from hitesh and his tea!");
});
//c
app.get("/ice-tea", (req, res) => {
  res.send("what ice tea would you prefer?");
});

app.get("/twitter", (req, res) => {
  res.send("hitesshdotcom");
});

// update

app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("tea not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.send(200).send(tea);
});

// delete tea

app.delete("/teas/:id", (req, res) => {
  const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("tea not found");
  }
  teaData.splice(index, 1);
  return res.status(204).send("deleted");
});

// port
app.listen(port, () => {
  console.log(`server is running at port: ${port}...`);
});
