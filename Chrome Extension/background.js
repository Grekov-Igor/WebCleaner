const requestURL = 'http://localhost:4444/api'
// получает сообщение от content-script.js и удаляет нужное из истории
chrome.runtime.onMessage.addListener(
    async function(request) {
        if (request.greeting === "autoDelete") {
            let sites
            let resultJWT = await chrome.storage.local.get(["jwt"])
            // resultJWT = JSON.parse(resultJWT)
            // let resultUser = await chrome.storage.local.get(["userId"])
            console.log(JSON.parse(resultJWT.jwt))
            resultJWT = JSON.parse(resultJWT.jwt)
            if(resultJWT !=0) {
                let links
                // let response = await fetch(`${requestURL}/blackList/id=${resultUser.userId}`)
                let response = await fetch(`${requestURL}/blackList/id`, {
                    method: 'GET',  
                    headers: {  
                        'Authorization': `Bearer ${resultJWT}`
                    },
                })
                // console.log(response)
                try {
                    links = await response.json()
                } catch(e) {
                    links=[]
                }
                // console.log(links)
                let arrLinks = []
                if(links !== []) {
                    for(let i=0; i<links.length; i++) {
                        arrLinks.push(links[i].blUrl)
                    }
                }
                // console.log(arrLinks)
                // localStorage.setItem('blackLinks', JSON.stringify(arrLinks))
                chrome.storage.local.set({
                    blackLinks: JSON.stringify(arrLinks)
                })
            }
            chrome.storage.local.get(["blackLinks"]).then((result) => {
                
                sites = JSON.parse(result.blackLinks)
                // console.log(sites)


                chrome.history.search({text: '', maxResults: 100} , function(data) {
                    data.forEach(async function(page) {
                        // console.log(page)
                        for(let i=0; i<sites.length;i++) {
                            if (page.url.indexOf(sites[i]) != -1) {
                                // console.log(page.title + " " + new Date(+page.lastVisitTime))
                                // sites.push(page.url)
                                if(resultJWT != 0) {
                                    // console.log(resultUser.userId)
                                    let data = JSON.stringify({
                                        dsUrl: page.url,
                                        dsDate: new Date(+page.lastVisitTime),
                                       
                                        dsTitle: page.title
                                    })
                                    // console.log(data)
                                    await fetch(`${requestURL}/deletedSite`, {
                                        method: 'POST',
                                        body: data,
                                        headers: {
                                            'Content-type': 'application/json; charset=utf-8',
                                            'Authorization': `Bearer ${resultJWT}`
                                        },
                                    })
                                }




                                chrome.history.deleteUrl({
                                    url: page.url
                                })
                            }
                        }
                    });
                });
            }); 
        }     
    }
);