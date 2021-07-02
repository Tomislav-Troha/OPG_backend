import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import auth from "../src/auth.js";

export function createRouter(db) {
  const router = express.Router();

  router.get("/tajna", [auth.verify], (req, res) => {
    res.json({ message: "Ovo je tajna " + req.jwt });
  });

  router.get("/prepelicja_jaja", (req, res) => {
    db.query(
      "SELECT id, proizvod, cijena, kolicina from prep_jaja",
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  });

  router.get("/Ukiseljena_prepelicja_jaja", (req, res) => {
    db.query(
      "SELECT id, proizvod, cijena, kolicina from ukis_prep_jaja ",
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  });

  router.get("/rezanci", (req, res) => {
    db.query(
      "SELECT id, proizvod, cijena, kolicina from rezanci ",
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  });

  router.post("/kosarica", [auth.verify], (req, res) => {
    let data = req.body;
    //console.log(data);
    db.query(
      "INSERT INTO kosarica (proizvod, cijena, kolicina) VALUES (?, ?, ?)",
      [data.proizvod, data.cijena, data.kolicina],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  });

  router.get("/kosarica", [auth.verify], (req, res) => {
    db.query(
      "SELECT id, proizvod, cijena, kolicina from kosarica ",
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  });

  router.get("/kosarica/proizvod", (req, res) => {
    db.query(
      "SELECT id, proizvod, cijena, kolicina from kosarica ",
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  });

  router.delete("/kosarica/:id", [auth.verify], (req, res) => {
    let data = req.params;
    //console.log(data);
    db.query("DELETE from kosarica WHERE id=?", [data.id], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ status: "error" });
      } else {
        res.status(200).json(result);
      }
    });
  });

  router.post("/users", async (req, res) => {
    let user = req.body;
    //console.log(user);
    let doc = {
      ime: user.ime,
      prezime: user.prezime,
      email: user.email,
      lozinka: await bcrypt.hash(user.lozinka, 8),
    };
    await db.query(
      "INSERT INTO registracija (ime, prezime, email, lozinka) VALUES (?, ?, ?, ?)",
      [doc.ime, doc.prezime, doc.email, doc.lozinka],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "Error" });
        } else res.status(200).json(result);
      }
    );
    return;
  });

  router.post("/auth", async (req, res) => {
    let email = req.body;
    await db.query(
      "SELECT email, lozinka FROM registracija WHERE email = ?",
      email.email,
      (error, result, lozinka, email) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: "error" });
        } else {
          let user = result[0];

          if (
            user &&
            user.lozinka &&
            bcrypt.compare(`` + lozinka, user.lozinka)
          ) {
            delete user.lozinka;
            let token = jwt.sign({ user }, process.env.JWT_SECRET, {
              algorithm: "HS512",
              expiresIn: "1 week",
            });
            return res.status(200).json({ token, email: user.email });
            {
            }
          } else {
            res.status(500).json({ status: "Prijava nesupijela" });
          }
        }
        return;
      }
    );
    return;
  });

  router.use("/private", [auth.verify]);

  return router;
}
