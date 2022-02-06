const data = {};
let userCounter = 0;
let statusScrap = false;
async function wait(seconds){
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve()
      },seconds*1000)
      
    })
  }

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    console.log("");
    
    if (message.action === 'getLinks') {
        console.log("");
        const dataMsg = message.data;
      let counter_users = 0;
      const numpages = Object.keys(dataMsg).length;
      for(let i=0;i<numpages;i++){
        const pageLinks = dataMsg[i];
        //console.log("pagelinks:",pageLinks);
        for(let j=0;j<pageLinks.length;j++){
            const link = pageLinks[j];
            const tab = await chrome.tabs.create({url:link,active:true});
            await wait(1);
            const port = await chrome.tabs.connect(tab.id);
            console.log("conection on")
            await wait(1);
            statusScrap = true;
            while(statusScrap){
                await wait(0.5);
            };
            
/*             await chrome.tabs.sendMessage(tab['id'], {action: "scrapData"});
            console.log("message sent")

            await wait(15);
            //close tab
            console.log("cerrando tab")
            await chrome.tabs.remove(tab.id); */

            counter_users++;
        }

      }
/*       //localStorage.setItem("num_users",counter_users);
      await chrome.storage.local.set({"num_users": counter_users}, function() {
        console.log('Value is set to ' + counter_users);
      });
 */
      userCounter = 0;
      // eliminate values of data
      
      console.log("scraping terminado !!!!!");
      console.log("data obtenida:",data);
      for (var member in data) delete data[member];

    }

    else if (message.action === 'finishLoading'){
        
        console.log("finishLoading");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action:"scrapData"}, function(response) {});  
        });
        
    }


    else if(message.action === 'sendDataProfile'){
        const dataProfile = message.data;
        data[userCounter] = dataProfile;
        userCounter = userCounter + 1;
        // close current window
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.remove(tabs[0].id);
        });
          statusScrap = false;
    }
  }); 

