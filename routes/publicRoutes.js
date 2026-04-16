const express      = require("express");
const router       = express.Router();
const College      = require("../models/College");
const AdminCourse  = require("../models/AdminCourse");
const Notice       = require("../models/Notice");

router.get("/colleges", async (_, res) => res.json(await College.find().sort({ createdAt: -1 })));
router.get("/courses",  async (_, res) => res.json(await AdminCourse.find().sort({ createdAt: -1 })));
router.get("/notices",  async (_, res) => res.json(await Notice.find().sort({ createdAt: -1 })));

module.exports = router;
