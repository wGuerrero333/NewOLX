const express = require("express");
const router = express.Router();

const { 
  getVentas, 
  getVenta,
  postVentas, 
  updateVenta, 
  deleteVenta 
} = require("../controllers/ventas.controller");

router.get("/", getVentas);

router.get("/:id", getVenta);
router.post("/", postVentas);
router.put("/:id", updateVenta);
router.delete("/:id", deleteVenta);

module.exports = router;
