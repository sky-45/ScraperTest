
let btnScrapper = document.getElementById("btnScrapper");

btnScrapper.addEventListener('click',async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if(tab !== null){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapProfileLinkedin,
          });
    }  
})

async function scrapProfileLinkedin() {
  
  // Defininf class
  class Profile {
    cssselectors = {
        name:'h1',
        contactCard:{
          profileUrl:'.ci-vanity-url > .pv-contact-info__ci-container > .pv-contact-info__contact-link',
          email:'.ci-email > .pv-contact-info__ci-container > .pv-contact-info__contact-link'
  
        }
      }
    async #wait(seconds){
      return new Promise(function(resolve,reject){
        setTimeout(function(){
          resolve()
        },seconds*1000)
      })
    }
  
    async getContactCard(){
        const {profileUrl,email} = this.cssselectors.contactCard;
        document.getElementById("top-card-text-details-contact-info").click();
        await this.#wait(0.5);
        const profileUrlElement = await document.querySelector(String(profileUrl))?.innerText;
        const emailLinkElement = await document.querySelector(String(email))?.innerText;
        const [closeButton] = document.getElementsByClassName('artdeco-button');
        await closeButton.click();
        await this.#wait(1);
  
        return  {
                  profileUrl: profileUrlElement,
                  email: emailLinkElement
                }
      }
  }
  
  // getting data
    const cssselectors = {
      name:'h1',
      contactCard:{
        profileUrl:'.ci-vanity-url > .pv-contact-info__ci-container > .pv-contact-info__contact-link',
        email:'.ci-email > .pv-contact-info__ci-container > .pv-contact-info__contact-link'

      }
    }

    async function wait(seconds){
      return new Promise(function(resolve,reject){
        setTimeout(function(){
          resolve()
        },seconds*1000)
      })
    }

    async function autoscroll(cssselectors){
      const element = document.querySelector(cssselectors);
      while(element){
        let maxScrollTop = document.body.clientHeight - window.innerHeight;
        let elementScrollTop = document.querySelector(cssselectors).offsetHeight;
        let currentScrollTop = window.scrollY;

        if(maxScrollTop <= currentScrollTop+20 || elementScrollTop <= currentScrollTop) break;
        await wait(0.05);

        let newScrollTop = Math.min(currentScrollTop + 20,maxScrollTop);

        window.scrollTo(0,newScrollTop);

      }
    }

    function getContactInfo(){
      const {name} = cssselectors;
      const nameElement = document.querySelector(name);
      
      const urlProfile = window.location.href;
      return  {
                name: nameElement?.textContent,
                url: urlProfile
              }
    }

    //const info = getContactInfo();
    //await autoscroll('body');
    //await wait(0.5);
    //const contact_Card = await getContactCard(); 
    //await wait(0.5);
    //console.log(contact_Card);


    
    const profile = new Profile();
    const contact_Card = await profile.getContactCard();
    console.log(contact_Card);
    
    //TODO: compelte rest of data parameters

    //formating data
    //  we have to format the data so that it's ready to push to the database

    //connect to the database and send the data
    //  do a post request to an endpoint where you take care of dong it
    // build and API with python(fastapi)where you get the json and send the sql query to the database

  }

