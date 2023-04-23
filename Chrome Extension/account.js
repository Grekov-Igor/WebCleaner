// const requestURL = 'http://localhost:4444/api/user'
// const xhr = new XMLHttpRequest()
// xhr.open('GET', requestURL)
// xhr.onload = () => {
//     console.log(JSON.parse(xhr.response))
// }
// xhr.send()
const requestURL = 'http://localhost:4444/api'
// const xhr = new XMLHttpRequest()

let btnAuth = document.querySelector('#btnAuth')
// console.log(btnAuth)
if (btnAuth) {
    btnAuth.addEventListener('click', authorization)
}


async function authorization() {
    let login = document.querySelector('#login').value
    let password = document.querySelector('#password').value
    // console.log(login, password)

    if (login === "" || password === "") {
        alert("Заполнены не все поля!")
        return
    }

    let user
    
    
    let response = await fetch(`${requestURL}/user/login=${login}`)
    console.log(response)
    user = await response.json()

    if(user == "") {
        alert("Пользователя с такими данными нет")
    } else if(user.userPassword === password) {
        // chrome.storage.local.set({
        //     userId: JSON.stringify(user.userId)
        // })
        localStorage.setItem('userId', JSON.stringify(user.userId))
        chrome.storage.local.set({
            userId: JSON.stringify(user.userId)
        })
        // chrome.runtime.openOptionsPage()
        window.location.href = "account.html";



        // alert(user.userId)
    } else {
        alert("Пользователя с такими данными нет")
    }

}

let btnReg = document.querySelector('#btnReg')
// console.log(btnAuth)
if (btnReg) {
    btnReg.addEventListener('click', registration)
}

async function registration() {
    let login = document.querySelector('#login').value
    let password = document.querySelector('#password').value
    let name = document.querySelector('#name').value
    let surname = document.querySelector('#surname').value
    let repPassword = document.querySelector('#repPassword').value

    if (login === "" || password === "" || name === "" || surname === "" || repPassword === "") {
        alert("Заполнены не все поля!")
        return
    }
    
    if(password !== repPassword) {
        alert("Пароль не совпадает")
        return
    }

    let user
    
    let response = await fetch(`${requestURL}/user/login=${login}`)
    // console.log(response)
    try {
        user = await response.json()
    } catch(e) {
        user=""
    }
   
    
    if(user != "") {
        alert("Пользователь с таким логином уже зарегистрирован")
        return
    }

    let data = JSON.stringify({
        userName: name,
        userSurname: surname,
        userLogin: login,
        userPassword: password
    })

    
    await fetch(`${requestURL}/user`, {
        method: 'POST',
        body: data,
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        },
    })
    console.log("Успех")
}


// на странице аккаунта получаем данные из бд по id пользователя

let checkAccPage = document.querySelector('.profileBlock')

if(checkAccPage) {
    let userId = JSON.parse(localStorage.getItem('userId'))
    console.log(userId)
    if(userId === 0) {
        
        window.location.href = "auth.html";
    } else {
        getUserData(userId)
    }
    // console.log(localStorage.getItem('userId'))
    
    
    
    
    
}

//функция для загрузки данных на страницу аккаунта
async function getUserData(userId) {
    // console.log(userId)
    let response = await fetch(`${requestURL}/user/id=${userId}`)
    let user = await response.json()
    let name = user.userSurname + " " + user.userName
    document.querySelector('#profileBlock__name').textContent = name    
}

// реализация выхода из аккаунта

let logOutBtn = document.querySelector("#profileBlock__logOut")

if(logOutBtn) {
    logOutBtn.addEventListener('click', exit)
}

function exit() {
    localStorage.setItem('userId', 0)
    chrome.storage.local.set({
        userId: 0
    })
    window.close()
    // chrome.runtime.openOptionsPage()

}

// реализация функционала журнала

// функция получения уникальных дат из бд
let sitesForPrintJournal
async function getUniqDates() {
    let response = await fetch(`${requestURL}/deletedSite/id=${localStorage.getItem('userId')}`) //получаю сайты пользователя
    let sites = await response.json()
    // console.log(sites)
    let arrUniqDates = []
    // sitesForPrintJournal = sites
    
    // console.log(new Date(new Date(sites[0].dsDate).toDateString()), new Date(new Date(sites[1].dsDate).toDateString()))
    // console.log(new Date(new Date(sites[0].dsDate).toDateString()) === new Date(new Date(sites[0].dsDate).toDateString()))
    if(sites.length!==0) {
        for(let i=0; i<sites.length; i++) {
        
            let date = new Date(sites[i].dsDate)
            // date = new Date(date.toDateString())
            // date = date.toISOString().split('T')[0]
            const dateCopy = new Date(date);
            dateCopy.setTime(dateCopy.getTime() - dateCopy.getTimezoneOffset()*60*1000);
            date = dateCopy.toISOString().split('T')[0]
            // console.log(date)
    
            if(arrUniqDates.indexOf(date) === -1) {
                arrUniqDates.push(date)
                // console.log(arrUniqDates.indexOf(date))
    
            }
            // console.log(date)
        }
    }
    
    // console.log(arrUniqDates)
    return arrUniqDates
}

async function printJournal() {
    let arrUniqDates = await getUniqDates()
    // console.log(arrUniqDates.sort().reverse()) 
    if(arrUniqDates.length===0) {
        return
    }
    document.querySelector(".journalBlockEmpty").style.display = 'none'
    console.log(arrUniqDates)
    arrUniqDates.sort().reverse() //получаем массив с датами по убыванию
    
    let blockNum = 0
    for(let i=0; i<arrUniqDates.length; i++) {
        console.log(new Date(new Date(arrUniqDates[i]).toDateString()))
        let date = new Date(new Date(arrUniqDates[i]).toDateString()).toISOString()
        let response = await fetch(`${requestURL}/deletedSite/${localStorage.getItem('userId')}&${date}`) //получаю сайты пользователя
        let sites = await response.json()
        console.log(sites)
        let day = 
        document.querySelector('.main__journal').insertAdjacentHTML('beforeend',
        `
        <div class="journalBlock">              
            <div class="journal__date">${new Date(new Date(arrUniqDates[i]).toDateString()).toLocaleDateString()}</div>
            <div class="journal__data">
                
            </div>
        </div>
        `)

        // console.log(document.getElementsByClassName("journalBlock")[document.getElementsByClassName("journalBlock").length-1])

        for (let j=0; j<sites.length; j++) {
            let journalBlocks = document.getElementsByClassName("journal__data")
            journalBlocks[journalBlocks.length-1].insertAdjacentHTML('afterbegin', 
            `
            <div class="journal__item" >
                <div class="jItem__info">
                    <div class="jItem__time">${new Date(sites[j].dsDate).toLocaleTimeString().substring(0, 5)}</div>
                    <a href="${sites[j].dsUrl}" target="_blank" class="jItem__title">${sites[j].dsTitle}</a>
                </div>
                
                <div href="" class="item__dots" id="btnDel__${sites[j].dsId}">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <rect width="20" height="20" fill="url(#pattern0)"/>
                        <defs>
                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlink:href="#image0_198_4" transform="scale(0.01)"/>
                        </pattern>
                        <image id="image0_198_4" width="100" height="100" xlink:href="data:image/png;base64,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"/>
                        </defs>
                    </svg>
                </div>
            </div>
            `)

            document.getElementById(`btnDel__${sites[j].dsId}`).addEventListener('click', deleteFromJournal)

            
        }
        
    }
    
}

if(document.querySelector(".journalBlock")) {
    printJournal()
}


// реализация удаления элемента из журнала
async function deleteFromJournal() {
    let id = this.id
    id = id.slice(8)
    // console.log(id)
    let journalItem = document.getElementById(`btnDel__${id}`).parentNode
    
    fetch(`${requestURL}/deletedSite/id=${id}`, {
        method: 'DELETE'
    })

    // если удалили последний элемент за день, удаляем блок дня
    let journalData = journalItem.parentNode
    journalItem.remove()
    // console.log(journalData.childElementCount)
    if(journalData.childElementCount===0) {
        journalData.parentNode.remove()
    }

    // если последний элемент за все время, то показываем заглушку пустоты
    if(!document.querySelector(".journal__item")) {
        document.querySelector(".journalBlockEmpty").style.display = 'flex'
    }
    
}

// реализация полной очистки журнала

let clrJournalBtn = document.querySelector("#clrJournalBtn")
if(clrJournalBtn) {
    clrJournalBtn.addEventListener('click', clearJournal)
}

async function clearJournal() {
    if(!document.querySelector(".journal__item")) {
        alert("Журнал уже пустой!")
        return
    }

    let journalBlocks = document.getElementsByClassName('journalBlock')
    // console.log(journalBlocks)
    for(let i =1; i<journalBlocks.length; i++) {
        journalBlocks[i].remove()
    }
    document.querySelector(".journalBlockEmpty").style.display = 'flex'

    fetch(`${requestURL}/deletedSite/userId=${localStorage.getItem('userId')}`, {
        method: 'DELETE'
    })
}


// реализация экспорта журнала в .xlsx

let exportXLSXbtn = document.querySelector("#exportBtn")
if(exportXLSXbtn) {
    exportXLSXbtn.addEventListener('click', exportXLSX)
}

function exportXLSX() {
    if(!document.querySelector(".journal__item")) {
        alert("Журнал пустой!")
        return
    }

    window.open(`${requestURL}/deletedSite/export/${localStorage.getItem('userId')}&${new Date().getTimezoneOffset()}`)
    
}
