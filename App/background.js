const data = {};
const data2 = []
let userCounter = 0;
let statusScrap = false;

let loadingMainPage = false;
async function wait(seconds){
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve()
      },seconds*1000)
      
    })
  }

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    console.log(message);
    
    if (message.action === 'getLinks') {
        console.log("");
        const dataMsg = message.data;
      let counter_users = 0;
      const numpages = Object.keys(dataMsg).length;
      for(let i=0;i<numpages;i++){
        const pageLinks = dataMsg[i].slice(0,1);   //.slice(0,1)
        //console.log("pagelinks:",pageLinks);
        for(let j=0;j<pageLinks.length;j++){
            const link = pageLinks[j];
            loadingMainPage = true;
            const tab = await chrome.tabs.create({url:link,active:true});
            await wait(1);
            const port = await chrome.tabs.connect(tab.id);
            console.log("conection on")
            await wait(0.5);
            statusScrap = true;
            while(statusScrap){
                await wait(0.1);
            };
            
/*             await chrome.tabs.sendMessage(tab['id'], {action: "scrapData"});
            console.log("message sent")

            await wait(15);
            //close tab
            console.log("cerrando tab")
            await chrome.tabs.remove(tab.id); */

            counter_users++;
            console.log("num users:",counter_users);

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
      console.log("data obtenida:");
      await wait(0.5);
/*       console.log(data2);
      console.log(data2[0]); */
      await wait(0.5);
      //enviamos los datos a la API
/*         const data_api = {
            "data": data2

        }
        //use fetch to send post request
        await wait(0.5);
        await fetch('http://127.0.0.1:8000/data2/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify(data_api)
        })
        await wait(0.5); */
        console.log("data enviada !!!");


      
      
      //for (var member in data) delete data[member];
/*       while(data2.length > 0) {
        data2.pop();
        }    */



    }

    else if (message.action === 'finishLoading'){
        if(loadingMainPage){
            console.log("finishLoading");
            loadingMainPage = false;
            await wait(0.5);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action:"scrapData"}, function(response) {});  
            });
            await wait(1);
            
        }
        
        
    }


    else if(message.action === 'sendDataProfile'){
        const dataProfile = message.data;
        const data_api = {
            "data": [dataProfile]
        }
        console.log(data_api)
        await wait(0.5);
        await fetch('https://scrapbackendlnk.azurewebsites.net/data3/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify(data_api)
        })
        await wait(0.5);
        console.log("data enviada !!!");
        //dataProfile.id = userCounter;

        //data[userCounter] = dataProfile;
        //data2.push(dataProfile);
        userCounter = userCounter + 1;
        // close current window
        await wait(0.5);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.remove(tabs[0].id);
        });
        await wait(0.5);
          statusScrap = false;
    }
  }); 

