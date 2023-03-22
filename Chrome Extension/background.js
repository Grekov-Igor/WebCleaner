// получает сообщение от content-script.js и удаляет нужное из истории
chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.greeting === "autoDelete") {
            let sites
            chrome.storage.local.get(["blackLinks"]).then((result) => {
                
                sites = JSON.parse(result.blackLinks)


                chrome.history.search({text: '', maxResults: 100} , function(data) {
                    data.forEach(function(page) {
                        for(let i=0; i<sites.length;i++) {
                            if (page.url.indexOf(sites[i].link) != -1) {
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