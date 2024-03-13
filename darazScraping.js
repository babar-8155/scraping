const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let url = 'https://www.daraz.pk/mens-sneakers/';
  let length = 10;

  const productInfo = [];

  for (let i = 0; i < length; i++) {
      await page.goto(url,{timeout:60000});

    const infoArr = await page.evaluate(() => {
      const imgSrc = document.querySelectorAll('.box--ujueT .gridItem--Yd0sa div #id-a-link');
      const pageData = [];

      imgSrc.forEach((img) => {
        const imghref = img.querySelector(".image-wrapper--ydch1 img").src;
        const title = img.querySelector(".description--H8JN9 .title-wrapper--IaQ0m").innerText;
        const currentPrice = img.querySelector(".description--H8JN9 #id-price .price-wrapper--S5vS_ .current-price--Jklkc .currency--GVKjl").innerText;
        const orignalPrice = img.querySelector(".description--H8JN9 #id-price .price-wrapper--S5vS_ .original-price--lHYOH").innerText;
        pageData.push({ ImageSource: imghref, Title: title, CurrentPrice: currentPrice, OrignalPrice: orignalPrice });
      });

      return pageData;
    });

    productInfo.push(...infoArr);
    await page.click("div.pager--mb0Ws div ul.ant-pagination li.ant-pagination-next");
    url = await page.url();


  }

  const jsonData = JSON.stringify(productInfo, null, 2);
  fs.writeFileSync('daraz.json', jsonData);
  await browser.close();
})();
