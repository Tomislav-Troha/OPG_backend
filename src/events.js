import express from "express";

export function createRouter(db) {
  const router = express.Router();

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

  router.post("/kosarica", (req, res) => {
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

  router.get("/kosarica", (req, res) => {
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

  router.delete("/kosarica/:id", (req, res) => {
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

  return router;
}
