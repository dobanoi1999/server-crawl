const animeCtrl = require("../controller/Anime");

const router = require("express").Router();

router.route("/").get(animeCtrl.getAllAnime);
router.route("/:name/:ep").get(animeCtrl.getInfoAnime);
module.exports = router;
