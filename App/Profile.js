  class Profile {
    //TODO: IMPLEMENT METHODS TO GET : experiencia, educacion, certificaciones
    
    // ---------- PROPERTIES -------------------------
    cssselectors = {
        generalInfo:{
            name:'h1',
            title:'#main >section .pv-text-details__left-panel>div+div',
            photouRL:'#main >section .pv-top-card--photo img'
        },
        contactCard:{
          profileUrl:'.ci-vanity-url > .pv-contact-info__ci-container > .pv-contact-info__contact-link',
          email:'.ci-email > .pv-contact-info__ci-container > .pv-contact-info__contact-link',
          website:'.ci-websites  .pv-contact-info__ci-container  .pv-contact-info__contact-link',
          twitter:'.ci-twitter  .pv-contact-info__ci-container  .pv-contact-info__contact-link'
        },
        experience:{
          expandButton:'#main #experience+div+div>div>a',
          experiencesSel:'main div+div>div>div>ul>li',
          backButton:'#main div button',
          experiencesMainPage:'#main #experience+div+div> ul > li'

        },
        education:{
            expandButton:'#main #education+div+div>div>a',
            educationsSel:'main ul > li.pvs-list__paged-list-item',
            backButton:'#main div button',
            educationsMainPage:'#main #education+div+div> ul > li',
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
    async getGeneralInfo(){
        const {name,title,photouRL} = this.cssselectors.generalInfo;
        const nameElement = await document.querySelector(name)?.innerText;
        const titleElement = await document.querySelector(title)?.innerText;
        const pictureLinkElement = await document.querySelector(photouRL)?.src;
        await Profile.wait(0.5);
        return  {
                name: nameElement,
                title: titleElement,
                photouRL: pictureLinkElement
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
      const {expandButton,experiencesSel,backButton,experiencesMainPage} = this.cssselectors.experience;
      
      //check if there's more experience than the default
        const expandButtonElement = document.querySelector(expandButton);
        await Profile.wait(0.5);
      if(expandButtonElement){
        await expandButtonElement.click();
        await Profile.wait(0.5);
        await Profile.autoscroll('body');
        const experiencesElem = document.querySelectorAll(experiencesSel);
        const listOfExps = [];
        for (const exp of experiencesElem) {
            if(exp.querySelectorAll('ul>li.pvs-list__paged-list-item').length>0){
                //multiple experiences in same company
                const miniexperiences = exp.querySelectorAll('ul>li.pvs-list__paged-list-item');
                for (const miniexp of miniexperiences) {
                    let position = miniexp.querySelector('.t-bold span')?.innerText;
                    let company = exp.querySelector('.t-bold')?.innerText;
                    let dateRange = miniexp.querySelector('div>div+div>div>a>span>span')?.innerText;
                    let location = exp.querySelector('div >div+div>div >a>span+span>span ')?.innerText;
                    await Profile.wait(0.5);
                    listOfExps.push({
                        position:position,
                        company:company,
                        dateRange:dateRange,
                        location:location
                    }) 
                    await Profile.wait(0.5);
                }
            }
            else{
                const detailsCompanyElement = exp.querySelector('div>div+div');
                let position = detailsCompanyElement.querySelector('.t-bold')?.innerText;
                let company = detailsCompanyElement.querySelector('div>div+span>span')?.innerText;
                let dateRange = detailsCompanyElement.querySelectorAll('div>div+span+span>span')[1]?.innerText;
                let location = detailsCompanyElement.querySelector('div>div+span+span+span>span')?.innerText;
                await Profile.wait(0.5);
                listOfExps.push({
                  position:position,
                  company:company,
                  dateRange:dateRange,
                  location:location
                }) 
            }
            
         }
          //closing experience page
          await Profile.wait(1);
        document.querySelector(backButton).click();
        await Profile.wait(1);

        return listOfExps;
      }
      else{
        const experiencesElem = document.querySelectorAll(experiencesMainPage);
        await Profile.wait(0.5);
        const listOfExps = [];
        for (const exp of experiencesElem) {
            const detailsCompanyElement = exp.querySelector('div>div+div');
            //getting details company
            let position = detailsCompanyElement.querySelector('.t-bold')?.innerText;
            let company = detailsCompanyElement.querySelector('div>div+span>span')?.innerText;
            let dateRange = detailsCompanyElement.querySelectorAll('div>div+span+span>span')[1]?.innerText;
            let location = detailsCompanyElement.querySelector('div>div+span+span+span>span')?.innerText;
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
      //go to experience page
      //window.location = window.location.href+'details/experience/'

        //const [expandButtonElement] = document.querySelector(expandButton);
        //if(expandButtonElement) expandButtonElement.click();

      //await Profile.wait(1);


    }
    async getEducation(){
        const { expandButton,educationsSel,backButton,educationsMainPage } = this.cssselectors.education;
        const expandButtonElement = document.querySelector(expandButton);
        await Profile.wait(0.5);
        if(expandButtonElement){
            await expandButtonElement.click();
            await Profile.wait(0.5);
            await Profile.autoscroll('body');
            const educationsElem = document.querySelectorAll(educationsSel);
            await Profile.wait(0.5);
            const listOfEduc = [];
            for (const exp of educationsElem) {
                const detailsEducatioonElement = exp.querySelector('div>div+div');
                //getting details company
                let institution = detailsEducatioonElement.querySelector('.t-bold span')?.innerText;
                let degree = detailsEducatioonElement.querySelector('div>div+div >div > a > span')?.innerText;
                let dateRange = detailsEducatioonElement.querySelector('div>div+div >div > a > span+span')?.innerText;
                await Profile.wait(0.5);
                listOfEduc.push({
                    institution:institution,
                    degree:degree,
                    dateRange:dateRange
                }) 
             }
            await Profile.wait(1);
            document.querySelector(backButton).click();
            await Profile.wait(0.5);
            return listOfEduc;
        }
        else{
            const educationsElem = document.querySelectorAll(educationsMainPage);
            await Profile.wait(0.5);
            const listOfEduc = [];
            for (const exp of educationsElem) {
                const detailsEducatioonElement = exp.querySelector('div>div+div');
                //getting details company
                let institution = detailsEducatioonElement.querySelector('.t-bold span')?.innerText;
                let degree = detailsEducatioonElement.querySelector('div>div+div >div > a > span')?.innerText;
                let dateRange = detailsEducatioonElement.querySelector('div>div+div >div > a > span+span>span')?.innerText;
                await Profile.wait(0.5);
                listOfEduc.push({
                    institution:institution,
                    degree:degree,
                    dateRange:dateRange
                }) 
             }
             await Profile.wait(0.5);
             return listOfEduc;
        }
    }

  }

  async function scrapProfile(){

    const profile = new Profile();
    await Profile.autoscroll('body');
    const generalInformation = await profile.getGeneralInfo();
    await Profile.wait(0.5);
    const contact_Card = await profile.getContactCard();
    await Profile.wait(1);
    const expList = await profile.getExperiences();
    await Profile.wait(1);
    const educList = await profile.getEducation();
    await Profile.wait(1);
    

          return {generalInfo:generalInformation,profilecard:contact_Card,experiences:expList,education:educList}
  }




chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("");

    if(message.action == "scrapData"){
                
        await Profile.wait(0.5);
        const data = await scrapProfile();
        await Profile.wait(0.5);
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





