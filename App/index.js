let btnScrapper = document.getElementById("btnScrapper");

btnScrapper.addEventListener('click',async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if(tab !== null){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapData,
          });
    }  
})

function scrapData() {
    //
    const name = document.querySelector('div.ph5.pb5 > div.mt2.relative > div:nth-child(1) > div:nth-child(1) > h1').innerHTML;

    console.log(name);
  }