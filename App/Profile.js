  class Profile {
    //TODO: IMPLEMENT METHODS TO GET : experiencia, educacion, certificaciones
    
    // ---------- PROPERTIES -------------------------
    cssselectors = {
        name:'h1',
        contactCard:{
          profileUrl:'.ci-vanity-url > .pv-contact-info__ci-container > .pv-contact-info__contact-link',
          email:'.ci-email > .pv-contact-info__ci-container > .pv-contact-info__contact-link',
          website:'.ci-websites  .pv-contact-info__ci-container  .pv-contact-info__contact-link',
          twitter:'.ci-twitter  .pv-contact-info__ci-container  .pv-contact-info__contact-link'
        },
        experience:{
          expandButton:'pv-profile-section__see-more-inline',
          experiencesSel:'main ul li'

        }
    }

    // ---------  DEFINING METHODS  -------------------------
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
        await Profile.wait(0.02);
  
        let newScrollTop = Math.min(currentScrollTop + 20,maxScrollTop);
  
        window.scrollTo(0,newScrollTop);
        }
      }
    
    async getContactCard(){
      //getting selectors
      const {profileUrl,email,website,twitter} = this.cssselectors.contactCard;
      //opening contact card
      document.getElementById("top-card-text-details-contact-info").click();
      await Profile.wait(0.5);
      // getting data
      const profileUrlElement = await document.querySelector(String(profileUrl))?.innerText;
      const emailLinkElement = await document.querySelector(String(email))?.innerText;
      const websiteElement = await document.querySelector(String(website))?.href;
      const twitterElement = await document.querySelector(String(twitter))?.href;
      //closing contact card
      const [closeButton] = document.getElementsByClassName('artdeco-button');
      await closeButton.click();
      //returning data
      await Profile.wait(0.5);
      return  {
                profileUrl: profileUrlElement,
                email: emailLinkElement,
                website: websiteElement,
                twitter: twitterElement
              }
      }
    async getExperiences(){
      //getting selectors
      const {expandButton,experiencesSel} = this.cssselectors.experience;
      //go to experience page
      window.location = window.location.href+'details/experience/'

        //const [expandButtonElement] = document.querySelector(expandButton);
        //if(expandButtonElement) expandButtonElement.click();

      await Profile.wait(0.5);
      //gettin array of experiences by company
      const experiences = document.querySelectorAll(experiencesSel);
      const listOfExps = [];
      for (const exp of experiences) {
        const detailsCompanyElement = exp.querySelector('a .pv-entity__summary-info');
        //getting details company
        let position = detailsCompanyElement.querySelector('h3')?.innerText;
        let company = detailsCompanyElement.querySelector('.pv-entity__secondary-title')?.innerText;
        let dateRange = detailsCompanyElement.querySelectorAll('.pv-entity__date-range>span')[1]?.innerText;
        let location = detailsCompanyElement.querySelectorAll('.pv-entity__location>span')[1]?.innerText;
        await Profile.wait(0.5);
        listOfExps.push({
          position:position,
          company:company,
          dateRange:dateRange,
          location:location

        })

      }
      return listOfExps;


    }
  }

  async function scrapProfile(){

    const profile = new Profile();
    await Profile.autoscroll('body');
    const contact_Card = await profile.getContactCard();
    //const expList = await profile.getExperiences();
          return {profilecard:contact_Card}
  }


/*   chrome.runtime.onConnect.addListener((port) =>{
    console.log("connected");

    port.onMessage.addListener(async (message) =>{
        if(message.action == "scrapData"){
            
            await Profile.wait(0.5);
            const data = await scrapProfile();
            await Profile.wait(1);
            port.postMessage({"action":"sendDataProfile","data":data});
            
        }
        
        return true;

    });
}); */


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("");

    if(message.action == "scrapData"){
                
        await Profile.wait(1);
        const data = await scrapProfile();
        await Profile.wait(1);
        chrome.runtime.sendMessage('dfdebnchipmdkkoecabkkkoefmdbpldn',{"action":"sendDataProfile","data":data}, function(response){
            //console.log("response,received");
            })
            console.log("");
    }



    return true
});


    //wait till page is loaded completely
document.onreadystatechange = async () => {
    //if (document.querySelector('#recent_activity')) {
        console.log('loaded');
        await Profile.wait(2);
        
        chrome.runtime.sendMessage('dfdebnchipmdkkoecabkkkoefmdbpldn',{"action":"finishLoading"}, function(response){
            //console.log("response,received");
            })


    
};





