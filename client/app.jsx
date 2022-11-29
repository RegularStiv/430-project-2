const socket = io();
let id = undefined;
const handleEditBox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editBox');
    const lang = document.querySelector('#langs');
    editForm.addEventListener('submit', (e) =>{
        e.preventDefault();

        if(editBox.value){
            const data = {
                msg: editBox.value,
                lang: lang.value,
                id: id
            }
            socket.emit('chat message', data);
            editBox.value = '';
        }
    })
};
const displayMessage = (msg) =>{
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    document.getElementById('messages').appendChild(messageDiv);
}
const setupRoom = (idImport) =>{
    //addevent listener
    console.log(id);
    id = idImport;
    socket.on(id, displayMessage);
}
const disconnectFromLobby = () =>{
    socket.emit('matchmaking', {
        command: 'disconnect',
        id: id
    });
    document.getElementById('messages').innerHTML = '';
}
const init = () => {
    handleEditBox();
    socket.on('chat message', displayMessage);
    socket.on('matchmaking', setupRoom);
    document.querySelector("#newLobby").onclick = disconnectFromLobby;
};

window.onload = init;