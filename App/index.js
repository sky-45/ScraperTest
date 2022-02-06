
let btnScrapper = document.getElementById("btnScrapper");


btnScrapper.addEventListener('click',async () => {
    
  //sending message to content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  

    if(tab !== null){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapProfileLinkedin,
          });
    }




})

async function scrapProfileLinkedin() {
  
  // Defining class
  class SearchPage{
    cssSelectors = {
      searchContainer:'.search-results-container',
      nextPage:'.artdeco-pagination > ul + button',
      listPeople:' div > ul > li'

    }
    
    static async wait(seconds){
      return new Promise(function(resolve,reject){
        setTimeout(function(){
          resolve()
        },seconds*1000)
        
      })
    }

    static async autoscroll(cssselectors){
      const element = document.querySelector(cssselectors);
      while(element){
        let maxScrollTop = document.body.clientHeight - window.innerHeight;
        let elementScrollTop = document.querySelector(cssselectors).offsetHeight;
        let currentScrollTop = window.scrollY;
  
        if(maxScrollTop <= currentScrollTop+20 || elementScrollTop <= currentScrollTop) break;
        await SearchPage.wait(0.02);
  
        let newScrollTop = Math.min(currentScrollTop + 20,maxScrollTop);
  
        window.scrollTo(0,newScrollTop);
        }
    }
    
    async getPeopleByPage(numPages){
      //getting selectors
      const {searchContainer,listPeople,nextPage} = this.cssSelectors;
      
      //
      const resultsURLSByPage = {};
      let actualPage = 1;
      for(let i = 0; i < numPages; i++){
        await SearchPage.wait(1);
        const listPeopleElement = document.querySelectorAll(searchContainer + '>' +listPeople);
        const linksProfiles = [];
        for (const person of listPeopleElement) {
          const profileUrl = person.querySelector('.entity-result__content>div a').href.split('?')[0];
          linksProfiles.push(profileUrl);
        }
        resultsURLSByPage[i] = linksProfiles;
        console.log(linksProfiles);
        if(actualPage<numPages){
          await SearchPage.autoscroll('body');
          const nextPageSelector = document.querySelector(searchContainer).querySelector(nextPage);
          await nextPageSelector.click();
          await SearchPage.wait(0.5);
          actualPage++;
        }

      }
      return resultsURLSByPage;


    }

  }


  const searchPageLK = new SearchPage();
  const data = await searchPageLK.getPeopleByPage(2);
  //console.log(data);
  
  chrome.runtime.sendMessage('dfdebnchipmdkkoecabkkkoefmdbpldn',{"action":"getLinks","data":data}, function(response){
  
  })
  



    //TODO: complete rest of data parameters

    //formating data
    //  we have to format the data so that it's ready to push to the database

    //connect to the database and send the data
    //  do a post request to an endpoint where you take care of dong it
    // build and API with python(fastapi)where you get the json and send the sql query to the database

  }

