import jwt from "jsonwebtoken";

export default {
  verify(req, res, next) {
    try {
      let authorization = req.headers.authorization.split(" ");
      let type = authorization[0];
      let token = authorization[1];

      if (type !== "Bearer") {
        res.status(401).send();
        return false;
      } else {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(req.jwt);
        return next();
      }
    } catch (e) {
      return res.status(401).json({ message: "Doslo je do greske" });
    }
  },
};
