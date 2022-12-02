const socket = io();
let id = undefined;
const helper = require("./helper.js");
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
const changePass = async (e) =>{
    e.preventDefault();
    const response = await fetch('/getToken');
    const data = await response.json();
    const pass = document.querySelector('#pass').value;
    const pass2 = document.querySelector('#pass2').value;
    const _csrf = data.csrfToken;
    helper.sendPost('/changePass',{pass, pass2, _csrf});
    document.querySelector("#content").textContent = "Password Changed";
}
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

const ChangePassWindow = (props) =>{
    return (
        <form id="changePass"
        name="changePass"
        onSubmit={changePass}
        action="/changePass"
        method="POST"
        className="changePassForm"
        >
            <label htmlFor='pass'>New Password: </label>
            <input id="pass" type="text" name="pass" placeholder='password' />
            <label htmlFor='pass2'>New Password: </label>
            <input id="pass2" type="text" name="pass2" placeholder='retype password' />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='formSubmit' type="submit" value="change password" />
        </form>
    );
};
const ChatWindow = (props) =>{
    return (
        <form id="chatForm"
        name="chatForm"
        onSubmit={handleEditBox}
        method="POST"
        className="chatForm"
        >
            <label htmlFor='username'>Message: </label>
            <input id="editBox" type="text" />
            <input type="submit" />
            <select id="langs">
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
            </select>
        </form>
    );
};
const DisconnectWindow = (props) => {
    return (
        <form id="disconnectForm"
        name="disconnectForm"
        onSubmit={disconnectFromLobby}
        method="POST"
        className="disconnectClass"
        >
            <button id="disconnect">Disconnect</button>
        </form>
    );
}
const ReconnectWindow = (props) => {
    return (
        <form id="reconnectForm"
        name="reconnectForm"
        onSubmit={disconnectFromLobby}
        method="POST"
        className="reconnectClass"
        >
            <button id="newLobby" >Find New Conversation</button>
        </form>
    );
}
const init = () => {
    handleEditBox();
    socket.on('chat message', displayMessage);
    socket.on('matchmaking', setupRoom);
    document.querySelector("#newLobby").onclick = disconnectFromLobby;
    const signupButton = document.getElementById('signupButton');
    
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
            document.querySelector("#changePass").onclick = changePass;
        return false;
    });
};

window.onload = init;