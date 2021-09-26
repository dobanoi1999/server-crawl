const puppeteer = require("puppeteer");
const homeCtrl = {
  getHome: async (req, res) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(process.env.URL_CRAWL);

    const data = await page.evaluate(() => {
      try {
        const highlightItems = document.querySelectorAll(".slider-item");
        const allAnime = document.querySelectorAll(
          ".tray.all > .tray-content > .tray-item"
        );
        const newEpisode = document.querySelectorAll(
          ".tray.episode >.tray-content > .tray-item"
        );
        const AllCartoon = document.querySelectorAll(
          ".tray.cartoon >.tray-content > .tray-item"
        );
        const AllPicked = document.querySelectorAll(
          ".tray.picked >.tray-content > .tray-item"
        );

        const highlights = [];
        const animes = [];
        const episodes = [];
        const cartoons = [];
        const picked = [];
        for (let i of highlightItems) {
          highlights.push({
            image: i.children[0].children[0].getAttribute("src") || "",
            title: i.children[0].children[0].getAttribute("alt") || "",
            href: i.children[0].getAttribute("href") || "",
          });
        }
        for (let i of newEpisode) {
          episodes.push({
            href: i.children[0].getAttribute("href") || "",
            image: i.children[0].children[0].getAttribute("src") || "",
            title: i.children[0].children[1].children[0].innerText || "",
            episode:
              i.children[0].children[1].children[1].children[0].innerText || "",
            views:
              i.children[0].children[1].children[1].children[1].innerText || "",
          });
        }
        for (let i of allAnime) {
          const href = i.children[0]?.getAttribute("href") || "";
          const image = i.children[0]?.children[0]?.getAttribute("src") || "";
          const title = i.children[0]?.children[1]?.children[0].innerText || "";
          const views =
            i.children[0]?.children[1]?.children[1]?.children[0]?.innerText ||
            "";

          animes.push({
            title,
            views,
            image,
            href,
          });
        }
        for (let i of AllPicked) {
          const href = i.children[0]?.getAttribute("href") || "";
          const image = i.children[0]?.children[0]?.getAttribute("src") || "";
          const title = i.children[0]?.children[1]?.children[0].innerText || "";
          const views =
            i.children[0]?.children[1]?.children[1]?.children[0]?.innerText ||
            "";

          picked.push({
            title,
            views,
            image,
            href,
          });
        }
        for (let i of AllCartoon) {
          const href = i.children[0]?.getAttribute("href") || "";
          const image = i.children[0]?.children[0]?.getAttribute("src") || "";
          const title = i.children[0]?.children[1]?.children[0].innerText || "";
          const views =
            i.children[0]?.children[1]?.children[1]?.children[0]?.innerText ||
            "";

          cartoons.push({
            title,
            views,
            image,
            href,
          });
        }
        return { animes, highlights, episodes, cartoons, picked };
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
module.exports = homeCtrl;
