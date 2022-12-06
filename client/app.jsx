const socket = io();
let id = undefined;
const helper = require("./helper.js");
let response = undefined;
let data = undefined;
const handleEditBox = (e) => {
    e.preventDefault();
    const editBox = document.getElementById('editBox');
    const lang = document.querySelector('#langs');
        

        if(editBox.value){
            const data = {
                msg: editBox.value,
                lang: lang.value,
                id: id
            }
            socket.emit('chat message', data);
            editBox.value = '';
        }
};
const changePass = async (e) =>{
    e.preventDefault();
    const pass = document.querySelector('#pass').value;
    const pass2 = document.querySelector('#pass2').value;
    const _csrf = data.csrfToken;
    helper.sendPost('/changePass',{pass, pass2, _csrf});
    document.querySelector("#messages").textContent = "Password Changed";
    ReactDOM.render(<ChatWindow csrf ={data.csrfToken} />,
        document.getElementById('content'));

}
const displayMessage = (msg) =>{
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    document.getElementById('messages').appendChild(messageDiv);
}
const setupRoom = async (idImport) =>{
    //console.log(id);
    id = idImport;
    socket.on(id, displayMessage);

    console.log('setuproom');
    console.log(data);
    ReactDOM.render(<DisconnectWindow csrf ={data.csrfToken}/>,
        document.getElementById('buttons'));
}
const disconnectFromLobby = (e) =>{
    e.preventDefault();
    socket.emit('matchmaking', {
        command: 'remove',
        id: id
    });
    document.getElementById('messages').innerHTML = '';

    console.log('disconnect');
    console.log(data);
    ReactDOM.render(<ReconnectWindow csrf ={data.csrfToken} />,
        document.getElementById('buttons'));
}
const connectToNewLobby = (e) => {
    e.preventDefault();
    socket.emit('matchmaking', {
        command: 'reconnect',
        id: id
    });
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
const AdWindow = (props) =>{
    return (
        <img src="" ></img>
    );
}
const ChatWindow = (props) =>{
    return (
        <form id="chatForm"
        name="chatForm"
        onSubmit={handleEditBox}
        method="POST"
        className="chatForm"
        >
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
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
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='formSubmit' type="submit" value="Disconnect" />
        </form>
    );
}
const ReconnectWindow = (props) => {
    return (
        <form id="reconnectForm"
        name="reconnectForm"
        onSubmit={connectToNewLobby}
        method="POST"
        className="reconnectClass"
        >
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='formSubmit' type="submit" value="Find New Conversation" />
        </form>
    );
}
const init = async () => {
    response = await fetch('/getToken');
    data = await response.json();
    console.log('init');
    console.log(data);

    socket.on('chat message', displayMessage);
    socket.on('matchmaking', setupRoom);
    const changePass = document.getElementById('changePass');

    changePass.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<ChangePassWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    ReactDOM.render(<ChatWindow csrf ={data.csrfToken} />,
        document.getElementById('content'));
    ReactDOM.render(<DisconnectWindow csrf ={data.csrfToken} />,
        document.getElementById('buttons'));
};

window.onload = init;