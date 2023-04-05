const requestURL = 'http://localhost:4444/api'
// получает сообщение от content-script.js и удаляет нужное из истории
chrome.runtime.onMessage.addListener(
    async function(request) {
        if (request.greeting === "autoDelete") {
            let sites
            let result = await chrome.storage.local.get(["userId"])
            // console.log(result.userId)
            if(result.userId !=0) {
                let links
                let response = await fetch(`${requestURL}/blackList/id=${result.userId}`)
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
                console.log(sites)


                chrome.history.search({text: '', maxResults: 100} , function(data) {
                    data.forEach(function(page) {
                        for(let i=0; i<sites.length;i++) {
                            if (page.url.indexOf(sites[i]) != -1) {
                                // sites.push(page.url)
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