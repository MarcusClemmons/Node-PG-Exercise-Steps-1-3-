


const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();




router.get("/", async  (req, res, next) => {
  try {
    const results = await db.query(
          `SELECT code, name FROM companies ORDER BY name`
    );
    return res.json({"companies": results.rows});
  }
  catch (err) {
    return next(err);
  }
});

router.get("/:code", async  (req, res, next) => {
  try {
    let code = req.params.code;
    const results = await db.query(
          `SELECT code, name, description FROM companies WHERE code = $1`, [code]);
   if (results.rows.length === 0) {
      throw new ExpressError(`company not found: ${code}`, 404)
    }
    return res.json({'companies': results.rows});
  }
  catch (err) {
    return next(err);
  }
});

router.post("/", async  (req, res, next) => {
  try {
    let {name, description} = req.body;
        const result = await db.query(
          `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
    return res.status(201).json({"company": result.rows[0]});
  }
  catch (err) {
    return next(err);
  }
});

router.put("/:code", async  (req, res, next) => {
  try {
    let {name, description} = req.body;
    let code = req.params.code;
    const result = await db.query(
          `UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description`, [name, description, code]);
    if (result.rows.length === 0) {
      throw new ExpressError(`company not found: ${code}`, 404)
    } else {
      return res.json({"company": result.rows[0]});
    }
  }
  catch (err) {
    return next(err);
  }
});

router.delete("/:code", async  (req, res, next) => {
  try {
    let code = req.params.code;
    const result = await db.query(
          `DELETE FROM companies WHERE code=$1 RETURNING code`, [code]);
    if (result.rows.length == 0) {
      throw new ExpressError(`company not found: ${code}`, 404)
    } else {
      return res.json({"status": "deleted"});
    }
  }
  catch (err) {
    return next(err);
  }
});


module.exports = router;