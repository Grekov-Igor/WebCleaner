const requestURL = 'http://localhost:4444/api'
// класс для работы с LocalStorage
class LocalStorageUtil {
    constructor(keyName) {
        this.keyName = keyName
    }

    getElements() {
        const elementsLocalStorage = localStorage.getItem(this.keyName)
        if (this.keyName === 'checkBoxes') {
            if (elementsLocalStorage !== null) {
                return JSON.parse(elementsLocalStorage)
            }
            return []
        } else if (this.keyName === 'timePeriod' || this.keyName === 'lightTheme' || this.keyName === 'language' || this.keyName === 'userId') {
            if (elementsLocalStorage !== null) {
                return elementsLocalStorage
            }
            return ''
        } else if (this.keyName === 'links' || this.keyName === 'blackLinks') {
            console.log(elementsLocalStorage)
            if (elementsLocalStorage !== null) {
                return JSON.parse(elementsLocalStorage)
            }
            return []
        }


    }

    putElements(id) {

        if (this.keyName === 'checkBoxes') {
            let elements = this.getElements()
            let index = elements.indexOf(id)

            if (index === -1) {
                elements.push(id)
            } else {
                elements.splice(index, 1)
            }


            localStorage.setItem(this.keyName, JSON.stringify(elements))
            chrome.storage.local.set({
                checkBoxes: JSON.stringify(elements)
            })
        } else if (this.keyName === 'timePeriod' || this.keyName === 'lightTheme' || this.keyName === 'language') {
            localStorage.setItem(this.keyName, id)
            chrome.storage.local.set({
                timePeriod: id
            })
        } else if (this.keyName === 'links' || this.keyName === 'blackLinks') {
            let elements = this.getElements()

            elements.push(id)

            localStorage.setItem(this.keyName, JSON.stringify(elements))
            if (this.keyName === 'links') {
                chrome.storage.local.set({
                    links: JSON.stringify(elements)
                })
            } else {
                chrome.storage.local.set({
                    blackLinks: JSON.stringify(elements)
                })
            }
        } else  if (this.keyName === 'userId') {
            localStorage.setItem(this.keyName, id)
        }
    }

    delElemet(id) {
        let elements = this.getElements()
        elements.splice(id, 1)
        // for (let i = id; i < elements.length; i++) {
        //     elements[i].number = elements[i].number - 1
        // }
        localStorage.setItem(this.keyName, JSON.stringify(elements))
        if (this.keyName === 'links') {
            chrome.storage.local.set({
                links: JSON.stringify(elements)
            })
        } else {
            chrome.storage.local.set({
                blackLinks: JSON.stringify(elements)
            })
        }
        // chrome.storage.local.set({links: JSON.stringify(elements)})
    }
}

const localStorageCheckBoxes = new LocalStorageUtil('checkBoxes')
const localStorageTimePeriod = new LocalStorageUtil('timePeriod')
const localStorageLinks = new LocalStorageUtil('links')
const localStorageBlackLinks = new LocalStorageUtil('blackLinks')
const localStorageLightTheme = new LocalStorageUtil('lightTheme')
const localStorageLanguage = new LocalStorageUtil('language')
const localStorageUser = new LocalStorageUtil('userId')


// реализация функции смены языка

let btnLanguage = document.getElementById("btnLanguage")
if (btnLanguage) {
    btnLanguage.addEventListener('click', changeLanguageWithDB)
}

function changeLanguageWithDB() {

    changeLanguage()
    if(localStorageUser.getElements() != 0) {
        let data = JSON.stringify({
            settingsId: localStorageUser.getElements(),
            settingsEng: localStorageLanguage.getElements()
        })
        fetch(`${requestURL}/settings/lang`, {
            method: 'PUT',
            body: data,
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
        })
    }
    

}

let english = localStorageLanguage.getElements() === 'true' //переменная, хранящая язык

function changeLanguage() {
    english = !english
    localStorageLanguage.putElements(String(english))
    Language()
}

let words
async function Language() {
    let url
    if (english !== true) {
        url = './translations/ru.json';
    } else {
        url = './translations/eng.json';
    }
    let response = await fetch(url);
    words = await response.json();

    for (let key in words) {
        let elem = document.querySelector('.lng-'+key)
        if (elem) {
            if (key !== 'themeSubtitle') {
                elem.textContent = words[key]
            } else {
                if (localStorageLightTheme.getElements() === 'true') {
                    elem.textContent = words[key]['light']
                } else {
                    elem.textContent = words[key]['dark']
                }
            }
            
        }
    }

    if ( document.querySelector(".buttonGrey__text")) {
        document.querySelector(".buttonGrey__text").textContent = document.querySelector('#'+localStorageTimePeriod.getElements()).textContent
    }  
    if (document.querySelector('#btnTheme')) {
        changeBtnThemeContent()
    }
    if(document.getElementById('input__area')) {
        document.getElementById('input__area').placeholder = words['placeholder']
    }
}
Language()




let checkBoxes = document.getElementsByClassName('check')
let timePeriod = (new Date()).getTime() - (1000 * 60 * 60)
// console.log(checkBoxes)

let buttonClear = document.getElementById('buttonClear')
if (buttonClear) {
    buttonClear.addEventListener('click', removeData)
}


let whiteList = [] //массив для хранения белого списка
// for (let i = 0; i < whiteList.length; i++) {
//     whiteList[i] = whiteList[i].link
// }

//обновление whiteList из бд
async function whiteListWithDB() {
    if(localStorageUser.getElements() != 0) {
        let links
        let response = await fetch(`${requestURL}/whiteList/id=${localStorageUser.getElements()}`)
        // console.log(response)
        try {
            links = await response.json()
        } catch(e) {
            links=[]
        }
        console.log(links)
        let arrLinks = []
        if(links !== []) {
            for(let i=0; i<links.length; i++) {
                arrLinks.push(links[i].wlUrl)
            }
        }
        console.log(arrLinks)
        localStorage.setItem('links', JSON.stringify(arrLinks))
    }

    whiteList = localStorageLinks.getElements()
    console.log(whiteList)
}

//функция удаления данных в зависимости от выбранных вариантов
async function removeData() {
    let checkBoxes = document.getElementsByClassName('check')
    await whiteListWithDB()
    console.log(whiteList)
    //let num = 0
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked === true) {

            //1. app cache

            if (checkBoxes[i].id === 'appCache') {
                chrome.browsingData.removeAppcache({
                    "since": timePeriod
                }, callback)
            }

            //2. Cache

            if (checkBoxes[i].id === 'cache') {
                chrome.browsingData.removeCache({
                    "since": timePeriod,
                    "excludeOrigins": whiteList
                }, callback)
            }

            //3. Cache Storage

            if (checkBoxes[i].id === 'cache') {
                chrome.browsingData.removeCacheStorage({
                    "since": timePeriod,
                    "excludeOrigins": whiteList
                }, callback)
            }

            //4. Cookies

            if (checkBoxes[i].id === 'cookies') {
                chrome.browsingData.removeCookies({
                    "since": timePeriod,
                    "excludeOrigins": whiteList

                }, callback)
            }

            //5. Downloads

            if (checkBoxes[i].id === 'downloads') {
                chrome.browsingData.removeDownloads({
                    "since": timePeriod
                }, callback)
            }

            //6. FileSystems

            if (checkBoxes[i].id === 'fileSystems') {
                chrome.browsingData.removeFileSystems({
                    "since": timePeriod,
                    "excludeOrigins": whiteList
                }, callback)
            }

            //7. AutoFill form

            if (checkBoxes[i].id === 'autoFill') {
                chrome.browsingData.removeFormData({
                    "since": timePeriod
                }, callback)
            }

            //8. History

            if (checkBoxes[i].id === 'history') {
                chrome.browsingData.removeHistory({
                    "since": timePeriod
                }, callback)
            }

            //9. IndexedDB

            if (checkBoxes[i].id === 'indexedDB') {
                chrome.browsingData.removeIndexedDB({
                    "since": timePeriod,
                    "excludeOrigins": whiteList
                }, callback)
            }

            //10. Local Storage

            if (checkBoxes[i].id === 'localStorage') {
                chrome.browsingData.removeLocalStorage({
                    "since": timePeriod,
                    "excludeOrigins": whiteList
                }, callback)
            }

            //11. Passwords

            if (checkBoxes[i].id === 'passwords') {
                chrome.browsingData.removePasswords({
                    "since": timePeriod
                }, callback)
            }

            //12. Plugin Data

            if (checkBoxes[i].id === 'pluginData') {
                chrome.browsingData.removePluginData({
                    "since": timePeriod
                }, callback)
            }

            //13. Service Workers

            if (checkBoxes[i].id === 'serviceWorkers') {
                chrome.browsingData.removeServiceWorkers({
                    "since": timePeriod,
                    "excludeOrigins": whiteList
                }, callback)
            }

            //14. Web Sql Data

            if (checkBoxes[i].id === 'wsd') {
                chrome.browsingData.removeWebSQL({
                    "since": timePeriod,
                    "excludeOrigins": whiteList
                }, callback)
            }

            //num++
        }
    }

}



// buttonClear.addEventListener('click', removeData)



let callback = function () {

    alert("Успех!")
};


// dropdown menu

let show = true
//функция отображения/показа меню
function showMenu() {
    let listDropdown = document.getElementById('list__dropdown')
    // console.log(listDropdown.style)
    if (show) {
        listDropdown.style.display = 'block'
    } else {
        listDropdown.style.display = 'none'
    }
    show = !show

}

const dropdownButton = document.getElementById('dropdown__button')

if (dropdownButton) {
    dropdownButton.addEventListener('click', showMenu)
}

// dropdownButton.addEventListener('click', showMenu)


let timeButtons = document.getElementsByClassName('list__item')
console.log(timeButtons)

for (let i = 0; i < timeButtons.length; i++) {
    timeButtons[i].addEventListener('click', chooseTimePeriod)
}

// функция замены значения периода времени, за которое надо удалить
function chooseTimePeriod() {
    // console.log('df')
    let id = this.id
    console.log(id)


    localStorageTimePeriod.putElements(id)

    if(localStorageUser.getElements() != 0) {
        // console.log(localStorageTimePeriod.getElements())
        let data = JSON.stringify({
            settingsId: localStorageUser.getElements(),
            settingsTimePeriod: localStorageTimePeriod.getElements()
        })

        fetch(`${requestURL}/settings/timePeriod`, {
            method: 'PUT',
            body: data,
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
        })
    }

    let buttonGreyText = document.querySelector('.buttonGrey__text')
    // console.log(buttonGreyText.textContent)

    buttonGreyText.textContent = this.textContent
    showMenu()

    switch (id) {
        case 'five__minutes':
            timePeriod = (new Date()).getTime() - (1000 * 60 * 5)
            break
        case 'hour':
            timePeriod = (new Date()).getTime() - (1000 * 60 * 60)
            break
        case 'day':
            timePeriod = (new Date()).getTime() - (1000 * 60 * 60 * 24)
            break
        case 'week':
            timePeriod = (new Date()).getTime() - (1000 * 60 * 60 * 24 * 7)

            break
        case 'month':
            timePeriod = (new Date()).getTime() - (1000 * 60 * 60 * 24 * 30)
            break
        case 'all__time':
            timePeriod = 0

    }
    // console.log(timePeriod)
}


let buttonDeleteOnThisPage = document.getElementById('buttonDeleteOnThisPage')
// console.log(buttonDeleteOnThisPage)
// function print() {
//     alert(tabs + "\n" + tabShort)
// }

if (buttonDeleteOnThisPage) {
    buttonDeleteOnThisPage.addEventListener('click', deleteOnThisPage)
    // buttonDeleteOnThisPage.addEventListener('click', test)
}


//функция удаления данных с текущей страницы
function deleteOnThisPage() {
    chrome.browsingData.remove({
        "origins": [tabShort]
    }, {
        "cacheStorage": true,
        "cookies": true,
        "fileSystems": true,
        "indexedDB": true,
        "localStorage": true,
        "serviceWorkers": true,
        "webSQL": true
    }, callback);


}


//функция для заненсения id чекбокса в LocalStorage
function checkBoxToStorage() {
    localStorageCheckBoxes.putElements(this.id)

    if(localStorageUser.getElements() != 0) {
        // console.log(localStorageCheckBoxes.getElements())
        let data = JSON.stringify({
            settingsId: localStorageUser.getElements(),
            settingsCheckBoxes: JSON.stringify(localStorageCheckBoxes.getElements())
        })
        // console.log(data)
        fetch(`${requestURL}/settings/checkBoxes`, {
            method: 'PUT',
            body: data,
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
        })
    }
}

//каждому чекбоксу задаем события на клик
for (let i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].addEventListener('click', checkBoxToStorage)
}

// выполняется на главной странице
// при открытии главной страницы из бд достается тема и язык пользователя
if(document.querySelector('.main__buttonGroup')) {
    // console.log(localStorageUser.getElements())
    let userId = localStorageUser.getElements()
    if(userId != 0) {
        
        getDataAboutThemeAndLang(userId)
    }
}

async function getDataAboutThemeAndLang(userId) {
    let settings
    let response = await fetch(`${requestURL}/settings/id=${userId}`)
    settings = await response.json()
    console.log(settings)
    if(localStorageLanguage.getElements() != JSON.stringify(settings.settingsEngLang)) {
        console.log(localStorageLanguage.getElements(), settings.settingsEngLang)
        console.log(localStorageLanguage.getElements() !== settings.settingsEngLang)
        // localStorageLanguage.putElements(settings.settingsEngLang)
        changeLanguage()
    }
    console.log(localStorageLightTheme.getElements(), JSON.stringify(settings.settingsLightTheme))
    if(localStorageLightTheme.getElements() != JSON.stringify(settings.settingsLightTheme)) {
        changeTheme()
    }

    
}



// выполняется на главной странице
// при открытии главной страницы из бд достается тема и язык пользователя
if(document.querySelector('.checkbox__group')) {
    // console.log(localStorageUser.getElements())
    let userId = localStorageUser.getElements()
    if(userId != 0) {
        getDataAboutCheckBoxes(userId)
        
    } else {
        // console.log(10110101010)
        getCheckBoxesFromLocalStorage()
    }
}

async function getDataAboutCheckBoxes(userId) {
    let settings
    let response = await fetch(`${requestURL}/settings/id=${userId}`)
    settings = await response.json()
    console.log(JSON.parse(settings.settingsCheckBoxes))
    localStorage.setItem('checkBoxes', JSON.stringify(JSON.parse(settings.settingsCheckBoxes)))
    localStorageTimePeriod.putElements(settings.settingsTimePeriod)
   
    getCheckBoxesFromLocalStorage()

}

function getCheckBoxesFromLocalStorage() {
     //достаем id активных чекбоксов из local storage и меняем у соответсвенных чекбоксов свойство checked на true
     let activeCheckBoxes = localStorageCheckBoxes.getElements()
    //  console.log(checkBoxes)
     if (activeCheckBoxes !== [] && checkBoxes.length !== 0) {
         for (let i = 0; i < activeCheckBoxes.length; i++) {
             let activeCheckBox = document.getElementById(activeCheckBoxes[i])
             activeCheckBox.checked = true
         }
     }
 
     console.log(document.getElementById(localStorageTimePeriod.getElements()))
     // && document.getElementById(localStorageTimePeriod.getElements() !== null
     if (localStorageTimePeriod.getElements() != '' && document.getElementById('dropdown__button') !== null) {
         //достаем из localStorage данные о периоде времени
         let storageTime = document.getElementById(localStorageTimePeriod.getElements())
         //для найденного в памяти времени запускаем событие клик, чтобы изменить значения поля и переменной
         show = false
         storageTime.click()
     }
}








// реализация функций на странице белого листа

// класс для работы с ссылками
class LinkItem {
    constructor(num, link) {
        this.number = num
        this.link = link
    }
}



// const localStorageLinks = new LocalStorageUtil('links')
let links = []




let btnAddToWhite = document.getElementById('btnAddToWhite')

if (btnAddToWhite) {
    btnAddToWhite.addEventListener('click', addToWhiteList)
}

async function printWhiteListWithDB() {
    await whiteListWithDB()
    
    if (localStorageLinks.getElements().length !== 0) {
        printWhiteList(localStorageLinks.getElements().length, localStorageLinks.getElements())
    }
}

// загрузка списка из local storage

let numberOfWhite = 0
console.log(localStorageLinks.getElements().length)
// console.log(document.querySelector('#listBlock_white'))
if (document.querySelector('#listBlock_white')) {
    // if (localStorageLinks.getElements().length !== 0) {
    //     printWhiteList(localStorageLinks.getElements().length, localStorageLinks.getElements())
    // }
    printWhiteListWithDB()
} else if (document.querySelector('#listBlock_black')) {
    if (localStorageBlackLinks.getElements().length !== 0) {
        printWhiteList(localStorageBlackLinks.getElements().length, localStorageBlackLinks.getElements())
    }
}

// if (localStorageLinks.getElements().length !== 0 && document.querySelector('.list__block')) {
//     printWhiteList()
// }

//функция отрисовки списка из local storage на странице


// console.log(numberOfWhite)
let btnDelete

function printWhiteList(nOW, linksS) {

    // numberOfWhite = localStorageLinks.getElements().length
    // links = localStorageLinks.getElements()
    numberOfWhite = nOW
    links = linksS
    linksNumber = 0
    // console.log(links)
    for (let i = 0; i < numberOfWhite; i++) {
        linksNumber++
        document.querySelector('.list__block').insertAdjacentHTML('beforeend',
            `
        <div class="block__item">
            <div class="block__text">
                <div class="item__number">${linksNumber}</div>
                <div class="item__link">${links[i]}</div>
            </div>
            
            <a href="#" class="item__dots" id="btnDelete__${linksNumber}">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <rect width="20" height="20" fill="url(#pattern0)"/>
                <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#image0_198_4" transform="scale(0.01)"/>
                </pattern>
                <image id="image0_198_4" width="100" height="100" xlink:href="data:image/png;base64,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"/>
                </defs>
                </svg>
            </a>
        </div>

        `)
        document.getElementsByClassName('empty__plug')[0].style.display = 'none'

        let btnDelete = document.getElementsByClassName('item__dots')
        btnDelete[linksNumber - 1].addEventListener('click', deleteFromWhite) //добавление обработчика новой появившейся кнопке

    }
}

// let numberOfWhite=0

//функция добавления нового элемента в список
function addToWhiteList() {
    let link = document.getElementById('input__area').value
    
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    // link !== ""
    if (link.match(regex)) {
        let numOfSlesh = 0
        let indexEnd = 0
        for (let i = 0; i < link.length; i++) {
            if (link[i] === '/') {
                numOfSlesh++
            }
            if (numOfSlesh === 3) {
                indexEnd = i

                break
            }
        }
        if (indexEnd !== 0) {
            link = link.slice(0, indexEnd + 1)
        }
        console.log(indexEnd + 1, link)

        if (numberOfWhite === 0) {
            // console.log(document.getElementsByClassName('empty__plug')[0])
            document.getElementsByClassName('empty__plug')[0].style.display = 'none'
        }
        numberOfWhite++
        document.querySelector('.list__block').insertAdjacentHTML('beforeend',
            `
        <div class="block__item">
            <div class="block__text">
                <div class="item__number">${numberOfWhite}</div>
                <div class="item__link">${link}</div>
            </div>
            
            <a href="#" class="item__dots" id="btnDelete__${numberOfWhite}">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <rect width="20" height="20" fill="url(#pattern0)"/>
                <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#image0_198_4" transform="scale(0.01)"/>
                </pattern>
                <image id="image0_198_4" width="100" height="100" xlink:href="data:image/png;base64,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"/>
                </defs>
                </svg>
            </a>
        </div>

        `)

        document.getElementById('input__area').value = ""
        // links.push(new LinkItem(numberOfWhite, link))
        if (document.querySelector('#listBlock_white')) {
            // localStorageLinks.putElements(new LinkItem(numberOfWhite, link))
            localStorageLinks.putElements(link)
            if(localStorageUser.getElements()!=0) {
                let data = JSON.stringify({
                    wlUrl: link,
                    userId: localStorageUser.getElements()
                })
                fetch(`${requestURL}/whiteList`, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Content-type': 'application/json; charset=utf-8'
                    },
                })
            }
        } else {
            localStorageBlackLinks.putElements(new LinkItem(numberOfWhite, link))
        }
        // localStorageLinks.putElements(new LinkItem(numberOfWhite, link))

        document.getElementById('main__body').scrollTop = document.getElementById('main__body').scrollHeight

        btnDelete = document.getElementsByClassName('item__dots')
        btnDelete[numberOfWhite - 1].addEventListener('click', deleteFromWhite) //добавление обработчика новой появившейся кнопке

        console.log(numberOfWhite)
    } else {
        alert("Ссылка некорректна. Введите ее заново и по шаблону или скопируйте ее!")
    }
    // console.log(link)

}


//функция удаления из списка

function deleteFromWhite() {
    let id = this.id
    id = id.slice(11)


    while (document.querySelector('.block__item')) {
        document.querySelector('.block__item').remove()
    }

    if (document.querySelector('#listBlock_white')) {
        if(localStorageUser.getElements()!=0) {
            let urlLink = localStorageLinks.getElements()[id-1]
            console.log(urlLink)
            let enc = encodeURIComponent(urlLink)
            console.log(`${requestURL}/whiteList/${localStorageUser.getElements()}&${enc}`)
            fetch(`${requestURL}/whiteList/${localStorageUser.getElements()}&${enc}`, {
                method: 'DELETE'
            })
        }
        localStorageLinks.delElemet(id - 1)
        if (localStorageLinks.getElements().length !== 0) {
            printWhiteList(localStorageLinks.getElements().length, localStorageLinks.getElements())
        } else {
            document.getElementsByClassName('empty__plug')[0].style.display = 'flex'
        }
        numberOfWhite = localStorageLinks.getElements().length
    } else {
        localStorageBlackLinks.delElemet(id - 1)
        if (localStorageBlackLinks.getElements().length !== 0) {
            printWhiteList(localStorageBlackLinks.getElements().length, localStorageBlackLinks.getElements())
        } else {
            document.getElementsByClassName('empty__plug')[0].style.display = 'flex'
        }
        numberOfWhite = localStorageBlackLinks.getElements().length
    }

    // localStorageLinks.delElemet(id - 1)
    // if (localStorageLinks.getElements().length !== 0) {
    //     printWhiteList()
    // } else {
    //     document.getElementsByClassName('empty__plug')[0].style.display = 'flex'
    // }
    // numberOfWhite = localStorageLinks.getElements().length

    console.log(numberOfWhite)

}


// реализация функции смены темы интерфейса

let btnTheme = document.getElementById('btnTheme')
let lightTheme //переменная отвечающая за состояние темы
if (localStorageLightTheme.getElements()==="") {
    lightTheme = true
} else {
    lightTheme = localStorageLightTheme.getElements() === 'true'
}


if (lightTheme === false) {
    document.body.classList.toggle('dark-theme')
}

if (btnTheme) {
    btnTheme.addEventListener('click', changeThemeWithDB)
    // changeBtnThemeContent()
}

function changeThemeWithDB() {
    changeTheme()
    if(localStorageUser.getElements() != 0) {
        let data = JSON.stringify({
            settingsId: localStorageUser.getElements(),
            settingsLight: localStorageLightTheme.getElements()
        })
        fetch(`${requestURL}/settings/theme`, {
            method: 'PUT',
            body: data,
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
        })
    }
}

function changeTheme() {
    lightTheme = !lightTheme
    localStorageLightTheme.putElements(String(lightTheme))
    document.body.classList.toggle('dark-theme')
    changeBtnThemeContent()
    // console.log(lightTheme)
}

function changeBtnThemeContent() {
    
    let btnSubTitle = document.getElementById('btnSubTitle')
    // console.log(btnSubTitle)
    let btnIcon = document.getElementById('btnIcon')
    btnIcon.innerHTML = ""
    console.log(words)
    if (localStorageLightTheme.getElements() === 'true') {
        
        btnSubTitle.textContent = words['themeSubtitle']['light']
        btnIcon.insertAdjacentHTML('beforeend', 
        `
        <svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 48 48"><path d="M24 34q-4.15 0-7.075-2.925T14 24q0-4.15 2.925-7.075T24 14q4.15 0 7.075 2.925T34 24q0 4.15-2.925 7.075T24 34ZM3.5 25.5q-.65 0-1.075-.425Q2 24.65 2 24q0-.65.425-1.075Q2.85 22.5 3.5 22.5h5q.65 0 1.075.425Q10 23.35 10 24q0 .65-.425 1.075-.425.425-1.075.425Zm36 0q-.65 0-1.075-.425Q38 24.65 38 24q0-.65.425-1.075.425-.425 1.075-.425h5q.65 0 1.075.425Q46 23.35 46 24q0 .65-.425 1.075-.425.425-1.075.425ZM24 10q-.65 0-1.075-.425Q22.5 9.15 22.5 8.5v-5q0-.65.425-1.075Q23.35 2 24 2q.65 0 1.075.425.425.425.425 1.075v5q0 .65-.425 1.075Q24.65 10 24 10Zm0 36q-.65 0-1.075-.425-.425-.425-.425-1.075v-5q0-.65.425-1.075Q23.35 38 24 38q.65 0 1.075.425.425.425.425 1.075v5q0 .65-.425 1.075Q24.65 46 24 46ZM12 14.1l-2.85-2.8q-.45-.45-.425-1.075.025-.625.425-1.075.45-.45 1.075-.45t1.075.45L14.1 12q.4.45.4 1.05 0 .6-.4 1-.4.45-1.025.45-.625 0-1.075-.4Zm24.7 24.75L33.9 36q-.4-.45-.4-1.075t.45-1.025q.4-.45 1-.45t1.05.45l2.85 2.8q.45.45.425 1.075-.025.625-.425 1.075-.45.45-1.075.45t-1.075-.45ZM33.9 14.1q-.45-.45-.45-1.05 0-.6.45-1.05l2.8-2.85q.45-.45 1.075-.425.625.025 1.075.425.45.45.45 1.075t-.45 1.075L36 14.1q-.4.4-1.025.4-.625 0-1.075-.4ZM9.15 38.85q-.45-.45-.45-1.075t.45-1.075L12 33.9q.45-.45 1.05-.45.6 0 1.05.45.45.45.45 1.05 0 .6-.45 1.05l-2.8 2.85q-.45.45-1.075.425-.625-.025-1.075-.425Z" fill="#3F8AE0"/></svg>
        `
        )
    } else {
        btnSubTitle.textContent = words['themeSubtitle']['dark']
        btnIcon.insertAdjacentHTML('beforeend', 
        `
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect width="25" height="25" fill="url(#pattern0)"/>
        <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_236_4" transform="scale(0.01)"/>
        </pattern>
        <image id="image0_236_4" width="100" height="100" xlink:href="data:image/png;base64,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"/>
        </defs>
        </svg>

        `
        )
    }
}


// при нажатии на кнопку входа переход на полноэкранную страницу авторизации

// let btnLogIn = document.querySelector("#btnLogIn")

// if (btnLogIn) {
//     btnLogIn.addEventListener('click', goToAuth)
// }

function goToAuth() {
    chrome.runtime.openOptionsPage()
}


// получаем id пользователя, если не авторизован - оставляем кнопку войти, 
// если авторизован, то меняем на кнопку аккаунта
let userId
let result = localStorageUser.getElements()
try {
    // при выходе из аккаунта userID = 0
    userId = JSON.parse(result)
    
    // console.log(userId)
} catch(error) {
    // если мы сюда попали, значит пока такого поля нет в памяти, значит пользователь ни разу не авторизировался
    // console.log(result.userId)
    userId = 0
}
// localStorageUser.putElements(JSON.stringify(userId))
let headerButtons = document.getElementById("header__buttons")
if(headerButtons) {
    if(userId === 0) {
        headerButtons.insertAdjacentHTML('afterbegin', `
            <button class="button__logIn button" id="btnLogIn">
                <div class="logIn__text">Войти</div>
            </button>
        `)
        let btnLogIn = document.querySelector("#btnLogIn")
        btnLogIn.addEventListener('click', goToAuth)
    
    
    } else {
        headerButtons.insertAdjacentHTML('afterbegin', `
            <img src="img/account.png" alt="" class="header__account" id="header__account">
        `)
        let btnAcc = document.querySelector("#header__account")
        btnAcc.addEventListener('click', goToAcc)
    }
}


function goToAcc() {
    // chrome.runtime.openOptionsPage()
    window.open(chrome.runtime.getURL('account.html'));
    
}



// console.log(result)
// chrome.storage.local.get(["userId"]).then((result) => {
    
    // try {
    //     // при выходе из аккаунта userID = 0
    //     userId = JSON.parse(result.userId)
        
    //     // console.log(userId)
    // } catch(error) {
    //     // если мы сюда попали, значит пока такого поля нет в памяти, значит пользователь ни разу не авторизировался
    //     // console.log(result.userId)
    //     userId = 0
    // }
    // localStorageUser.putElements(JSON.stringify(userId))
    // let headerButtons = document.getElementById("header__buttons")
    // if(userId === 0) {
    //     headerButtons.insertAdjacentHTML('afterbegin', `
    //         <button class="button__logIn button" id="btnLogIn">
    //             <div class="logIn__text">Войти</div>
    //         </button>
    //     `)
    //     let btnLogIn = document.querySelector("#btnLogIn")
    //     btnLogIn.addEventListener('click', goToAuth)
    

    // } else {
    //     headerButtons.insertAdjacentHTML('afterbegin', `
    //         <img src="img/account.png" alt="" class="header__account" id="header__account">
    //     `)
    // }


    

// })

// chrome.storage.local.set({
//     userId: JSON.stringify(0)
// })

// let url = "https://www.figma.com/"
// let enc = encodeURIComponent(url)
// console.log(enc)



//получение url текущей страницы и обрезание лишнего
let tabs //хранит полный url
let tabShort //хранит протокол и домен

async function getCurrentTab() {
    let queryOptions = {
        active: true,
        lastFocusedWindow: true
    };

    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url)
    tabs = tab.url
    let numOfSlesh = 0
    let indexEnd
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i] === '/') {
            numOfSlesh++
        }
        if (numOfSlesh === 3) {
            indexEnd = i

            break
        }
    }
    tabShort = tabs.slice(0, indexEnd)
    // return tabUrl;
}
getCurrentTab()