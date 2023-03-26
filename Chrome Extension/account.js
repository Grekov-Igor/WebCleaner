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
        user = JSON.parse(xhr.response)
    }
    // console.log(user)
    xhr.send()
    // console.log(user)
    if(user.userPassword === password) {
        alert("Ура")
    }

}
