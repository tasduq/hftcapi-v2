const express = require("express");

const protectiveStyleController = require("../controllers/protectivestyle-controllers");

const router = express.Router();

router.post(
  "/addprotectivestyle",
  protectiveStyleController.addProtectiveStyle
);
router.post(
  "/getuserprotectivestyle",
  protectiveStyleController.getProtectiveStyle
);
router.post(
  "/getprotectivestyleimage",
  protectiveStyleController.getProtectiveStyleImage
);

module.exports = router;
