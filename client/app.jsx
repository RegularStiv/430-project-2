//sets up socket and connection to lobbies
const socket = io();
let id = undefined;
const helper = require("./helper.js");
let response = undefined;
let data = undefined;

// handles the text box being sent to the server with id, message and language to convert to
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
            if(id !== undefined){
                socket.emit('chat message', data);
            }
            editBox.value = '';
        }
};

//change password logic
const changePass = async (e) =>{
    e.preventDefault();
    const pass = document.querySelector('#pass').value;
    const pass2 = document.querySelector('#pass2').value;
    const _csrf = data.csrfToken;
    //if there is a problem with passwords not being filled out or passwords not matching throw error
    if(!pass || !pass2){
        document.querySelector("#messages").textContent = "Passwords need to match and be longer than 1 character";
    } else if(pass !== pass2){
        document.querySelector("#messages").textContent = "Passwords need to match and be longer than 1 character";
    } else{
        // call change password once there is no problem with the inputs
        helper.sendPost('/changePass',{pass, pass2, _csrf});
        document.querySelector("#messages").textContent = "Password Changed";
        ReactDOM.render(<ChatWindow csrf ={data.csrfToken} />,
        document.getElementById('content'));
    }
}

//display the message to the user if needed
const displayMessage = (msg) =>{
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    document.getElementById('messages').appendChild(messageDiv);
}

//make the room and send messages only to that id also make a button to leave the conversation
const setupRoom = async (idImport) =>{
    id = idImport;
    socket.on(id, displayMessage);
    ReactDOM.render(<DisconnectWindow csrf ={data.csrfToken}/>,
        document.getElementById('buttons'));
}

//leave the lobby when wanted
const disconnectFromLobby = (e) =>{
    e.preventDefault();
    socket.emit('matchmaking', {
        command: 'remove',
        id: id
    });
    document.getElementById('messages').innerHTML = '';
    id = undefined;
    ReactDOM.render(<ReconnectWindow csrf ={data.csrfToken} />,
        document.getElementById('buttons'));
}

//connect to a new lobby and tell the user that it is searching for a new connection
const connectToNewLobby = (e) => {
    e.preventDefault();
    socket.emit('matchmaking', {
        command: 'reconnect',
        id: id
    });
    ReactDOM.render(<SearchWindow csrf ={data.csrfToken} />,
        document.getElementById('buttons'));
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
//render the ads
const AdWindow = (props) =>{
    return (
        <div id="adWindow">AD SPACE</div>
    );
}
//render the searching dialogue
const SearchWindow = (props) => {
    return (
        <div id="searchingWindow">Searching for a Conversation...</div>
    );
}
//render the chat window
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
//render the disconnect button
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
//render the connect button
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
//init
const init = async () => {
    response = await fetch('/getToken');
    data = await response.json();

    //sets up the socket interactions
    socket.on('chat message', displayMessage);
    socket.on('matchmaking', (msg) => {
        if(msg.command === 'reconnect'){
            setupRoom(msg.id);
        } else if(msg.command === 'remove'){
            id = undefined;
        }   
    });

    //sets up change password buttons
    const changePass = document.getElementById('changePass');

    changePass.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<ChangePassWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    //render defaults
    ReactDOM.render(<ChatWindow csrf ={data.csrfToken} />,
        document.getElementById('content'));
    ReactDOM.render(<ReconnectWindow csrf ={data.csrfToken} />,
        document.getElementById('buttons'));
    ReactDOM.render(<AdWindow csrf = {data.csrfToken} />,
        document.getElementById('adSpace'));;
};

window.onload = init;