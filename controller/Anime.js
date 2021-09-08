const puppeteer = require("puppeteer");
const animeCtrl = {
  getAllAnime: async (req, res) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const p = req.query?.page || "";

    await page.goto(`${process.env.URL_CRAWL}/anime/${p}`);

    const data = await page.evaluate(() => {
      try {
        const allAnime = document.querySelectorAll(
          ".tray> .tray-content > .tray-item"
        );
        const paginationList = document.querySelectorAll(
          ".pagination > .page-item"
        );
        const animes = Array.from(allAnime).map((i) => {
          return {
            href: i.children[0]?.getAttribute("href") || "",
            image: i.children[0]?.children[0]?.getAttribute("src") || "",
            title: i.children[0]?.children[1]?.children[0].innerText || "",
            views:
              i.children[0]?.children[1]?.children[1]?.children[0]?.innerText ||
              "",
          };
        });

        const pagination = Array.from(paginationList).map((i, index) => {
          return {
            href: i.children[0]?.getAttribute("href"),
            text:
              index === 0
                ? "icon-backward"
                : index === paginationList.length - 1
                ? "icon-forward"
                : i.children[0]?.innerText,
          };
        });

        return { animes, pagination };
      } catch (error) {
        return {};
      }
    });
    await browser.close();
    if (typeof data !== "object") {
      return res.json({});
    }
    res.json(data);
  },
  getInfoAnime: async (req, res) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const { name, ep } = req.params || "";
    await page.goto(`${process.env.URL_CRAWL}/${name}/${ep}`);

    const data = await page.evaluate(() => {
      try {
        const title =
          document.querySelector(".film-info-title").innerText || "";
        const views =
          document.querySelector(".film-info-views > span").innerText || "";
        const desc =
          document.querySelector(".film-info > .film-info-description")
            .innerText || "";
        const genreDoc =
          document.querySelector(".film-info > .film-info-genre") || [];
        const episodeList = document.querySelectorAll(".episode-item");
        const genre = Array.from(genreDoc.children).map((i) => {
          return {
            href: i.getAttribute("href"),
            tag: i.innerText,
          };
        });
        const episodes = Array.from(episodeList).map((i) => {
          return {
            href: i.children[0]?.getAttribute("href") || "/",
            text: i.children[0]?.children[1]?.children[0]?.innerText || "",
          };
        });
        const video =
          document.getElementsByTagName("video")[0]?.getAttribute("src") || "";

        const info = { video, title, views, desc, genre };
        return {
          info,
          episodes,
        };
      } catch (error) {
        return {};
      }
    });
    browser.close();
    if (typeof data !== "object") {
      return res.json({});
    }
    res.json(data);
  },
};
module.exports = animeCtrl;
