const puppeteer = require("puppeteer");
const newEpCtrl = {
  getAllAnime: async (req, res) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(`${process.env.URL_CRAWL}/tap-moi-nhat`);

    const data = await page.evaluate(() => {
      try {
        const allAnime = document.querySelectorAll(
          ".tray.episode > .tray-item"
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

        return { animes };
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
};
module.exports = newEpCtrl;
