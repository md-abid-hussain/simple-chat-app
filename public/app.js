const socket = io()
let username = localStorage.getItem("username")

if(!username){
    username = prompt('Please enter username')
    localStorage.setItem("username",username)
}
let msg = 0;
function sendMessage(e) {
    e.preventDefault()
    const input = document.querySelector('input')
    console.log(input.value)
    if (input.value) {
        socket.emit('message',JSON.stringify({
            username:username,
            message:input.value
        }))
        input.value = ""
    }
    input.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage)

// Listen for messages 
socket.on("chat message", ( data ) => {
    const parseData = JSON.parse(data)
    const li = document.createElement('li')

    const user = document.createElement('span')
    user.classList.add('user')
    user.innerText = parseData.username + ' : '

    const message = document.createElement('span')
    message.classList.add('message')
    message.innerText = parseData.message

    li.appendChild(user)
    li.appendChild(message)
    document.querySelector('ul').appendChild(li)
    window.scrollTo(0, document.body.scrollHeight);
})