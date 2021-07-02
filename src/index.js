import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mysql from "mysql";
import { createRouter } from "../src/events.js";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "opgJurkovic",
});

connection.connect();

const app = express(); // instanciranje aplikacije
const port = process.env.PORT || 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json());
app.use(createRouter(connection));

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
