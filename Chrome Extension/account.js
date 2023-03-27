// const requestURL = 'http://localhost:4444/api/user'
// const xhr = new XMLHttpRequest()
// xhr.open('GET', requestURL)
// xhr.onload = () => {
//     console.log(JSON.parse(xhr.response))
// }
// xhr.send()
const requestURL = 'http://localhost:4444/api/user'
const xhr = new XMLHttpRequest()

let btnAuth = document.querySelector('#btnAuth')
// console.log(btnAuth)
if (btnAuth) {
    btnAuth.addEventListener('click', authorization)
}

// async function getReq (reqUrl) {
//     let res
//     xhr.open('GET', requestURL+'/'+login)
//     xhr.onload = () => {
//         // console.log(JSON.parse(xhr.response))
//         return JSON.parse(xhr.response)
//     }
//     await xhr.send()
// }

function authorization() {
    let login = document.querySelector('#login').value
    let password = document.querySelector('#password').value
    // console.log(login, password)
    
    let user
    
    xhr.open('GET', requestURL+'/'+login, false)
    xhr.onload = () => {
        // console.log(JSON.parse(xhr.response))
        user = xhr.response
        // console.log(user)
        if (user != "") {
            user = JSON.parse(user)
        }
        
    }
    // console.log(user)
    xhr.send()
    // console.log(user)
    if(user == "") {
        alert("Пользователя с такими данными нет")
    } else if(user.userPassword === password) {
        alert("Ура")
    } else {
        alert("Пользователя с такими данными нет")
    }

}

let btnReg = document.querySelector('#btnReg')
// console.log(btnAuth)
if (btnReg) {
    btnReg.addEventListener('click', registration)
}

function registration() {
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
    
    xhr.open('GET', requestURL+'/'+login, false)
    xhr.onload = () => {
        // console.log(JSON.parse(xhr.response))
        user = xhr.response
        // console.log(user)
        if (user != "") {
            user = JSON.parse(user)
        }
        
    }
    // console.log(user)
    xhr.send()
    
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

    xhr.open("POST", requestURL)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(data)
    xhr.onloadend = function() {
        if (xhr.status == 200) {
          console.log("Успех");
        } else {
          console.log("Ошибка " + this.status);
        }
      };
}
