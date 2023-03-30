// const requestURL = 'http://localhost:4444/api/user'
// const xhr = new XMLHttpRequest()
// xhr.open('GET', requestURL)
// xhr.onload = () => {
//     console.log(JSON.parse(xhr.response))
// }
// xhr.send()
const requestURL = 'http://localhost:4444/api/user'
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
    
    
    let response = await fetch(`${requestURL}/login=${login}`)
    console.log(response)
    user = await response.json()

    if(user == "") {
        alert("Пользователя с такими данными нет")
    } else if(user.userPassword === password) {
        // chrome.storage.local.set({
        //     userId: JSON.stringify(user.userId)
        // })
        localStorage.setItem('userId', JSON.stringify(user.userId))
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
    
    let response = await fetch(`${requestURL}/login=${login}`)
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

    
    await fetch(requestURL, {
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
    let response = await fetch(`${requestURL}/id=${userId}`)
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
    window.close()
    // chrome.runtime.openOptionsPage()

}