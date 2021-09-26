const puppeteer = require("puppeteer");
const animeCtrl = {
  getRankAnimes: async (req, res) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    let type = req.params?.type || "";
    switch (type) {
      case "day":
        type = "";
        break;
      case "week":
        type = "tuan";
        break;
      case "month":
        type = "thang";
        break;
      case "year":
        type = "nam";
        break;
      default:
        type = "";
        break;
    }

    await page.goto(`${process.env.URL_CRAWL}/bang-xep-hang/${type}`);

    const data = await page.evaluate(() => {
      try {
        const allAnime = document.querySelectorAll(".tray.rank>.tray-item");
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

        return { animes };
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
