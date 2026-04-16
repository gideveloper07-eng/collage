const express   = require("express");
const router    = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  adminLogin, seedAdmin,
  getColleges, addCollege, updateCollege, deleteCollege,
  getCourses,  addCourse,  updateCourse,  deleteCourse,
  getNotices,  addNotice,  updateNotice,  deleteNotice,
} = require("../controllers/adminController");

// Public
router.post("/login",     adminLogin);
router.get ("/seed",      seedAdmin);   // hit once to create admin account

// Protected (admin only)
router.get   ("/colleges",        adminAuth, getColleges);
router.post  ("/colleges",        adminAuth, addCollege);
router.put   ("/colleges/:id",    adminAuth, updateCollege);
router.delete("/colleges/:id",    adminAuth, deleteCollege);

router.get   ("/courses",         adminAuth, getCourses);
router.post  ("/courses",         adminAuth, addCourse);
router.put   ("/courses/:id",     adminAuth, updateCourse);
router.delete("/courses/:id",     adminAuth, deleteCourse);

router.get   ("/notices",         adminAuth, getNotices);
router.post  ("/notices",         adminAuth, addNotice);
router.put   ("/notices/:id",     adminAuth, updateNotice);
router.delete("/notices/:id",     adminAuth, deleteNotice);

module.exports = router;
