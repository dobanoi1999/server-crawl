const newEpCtrl = require("../controller/NewEp");

const router = require("express").Router();

router.route("/").get(newEpCtrl.getAllAnime);

module.exports = router;
