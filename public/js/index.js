const socket = io()

const messageLogs = document.getElementById('chat-window')
const chatBox = document.getElementById('inputMsg')
const btnSend = document.getElementById('btnSend')

btnSend.addEventListener('click', (event) => {
    event.preventDefault()

    const msg = chatBox.value
    console.log(msg)

    socket.emit('message', msg)
  
})

socket.on('message', data => {
    const {user, msg} = data

    const p = document.createElement('p');
    p.textContent = `Cliente${user}: ${msg}`;
    messageLogs.appendChild(p);
    messageLogs.scrollTop =messageLogs.scrollHeight

})





