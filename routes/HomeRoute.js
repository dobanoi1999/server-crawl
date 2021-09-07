const homeCtrl = require("../controller/HomeCtrl");

const router = require("express").Router();

router.route("/").get(homeCtrl.getHome);
module.exports = router;
