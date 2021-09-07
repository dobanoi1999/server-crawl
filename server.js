require("dotenv").config();
const cors = require("cors");
const express = require("express");

const port = process.env.PORT || 8888;
const app = express();
app.use(cors());
app.use("/api/", require("./routes/HomeRoute"));
app.use("/api/anime", require("./routes/AnimeRoute"));
app.use("/api/anime/:name/:ep", require("./routes/AnimeRoute"));
app.listen(port, () => console.log(`server is running ${port}`));
