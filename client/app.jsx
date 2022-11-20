const socket = io();

const handleEditBox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editBox');

    editForm.addEventListener('submit', (e) =>{
        e.preventDefault();

        if(editBox.value){
            socket.emit('chat message', editBox.value);
            editBox.value = '';
        }
    })
};
const displayMessage = (msg) =>{
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    document.getElementById('messages').appendChild(messageDiv);
}
const init = () => {
    handleEditBox();
    socket.on('chat message', displayMessage);
};

window.onload = init;