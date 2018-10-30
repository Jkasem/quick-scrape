const fs = require("fs");
const puppeteer = require("puppeteer");
const config = require("./config");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // TODO: ad blocker

  if (config.LinkedIn)
    await page.setCookie({
      name: "li_at",
      value: config.LinkedInCookie,
      domain: "www.linkedin.com",
    });

  await page.goto(config.URL, {
    timeout: 25000,
    waitUntil: "networkidle2",
  });

  const result = await page.evaluate(selector => {
    const data = []; // Create an empty array that will store our data
    const elements = document.querySelectorAll(selector); // Select all
    for (const element of elements) {
      // Loop through each
      let title = element.innerText; // Select a link title
      let href = element.href; // Select the link href

      data.push({ title, href }); // Push an object with the data onto our array
    }

    return data; // Return our data array
  }, config.selector);
  await browser.close();

  fs.writeFile(
    "./data/results.json",
    JSON.stringify(result, null, 2),
    "utf8",
    function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Success");
    }
  );
})();
