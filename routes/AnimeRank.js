const animeCtrl = require("../controller/AnimeRank");

const router = require("express").Router();

router.route("/:type").get(animeCtrl.getRankAnimes);
module.exports = router;
