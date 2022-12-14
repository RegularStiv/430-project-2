const helper = require('./helper.js');

//log in if you have the right username and password
const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, _csrf});

    return false;
}

// create an account using username and password
const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass || !pass2){
        helper.handleError('Username or password is empty!');
        return false;
    }
    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, _csrf});

    return false;
}
//render the login window
const LoginWindow = (props) =>{
    return (
        <form id="loginForm"
        name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
        >
            <label htmlFor='username'>Username: </label>
            <input id="user" type="text" name="username" placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id="pass" type="text" name="pass" placeholder='password' />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='formSubmit' type="submit" value="sign in" />
        </form>
    );
};
//render the logo
const LogoWindow = (props) =>{
    return(
        <a href="/login"><img id="mainLogo" src="/assets/img/logo.png" alt="logo"/></a>
    );
};
//render the signup window
const SignupWindow = (props) =>{
    return (
        <form id="signupForm"
        name="signupForm"
        onSubmit={handleSignup}
        action="/signUp"
        method="POST"
        className="mainForm"
        >
            <label htmlFor='username'>Username: </label>
            <input id="user" type="text" name="username" placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id="pass" type="text" name="pass" placeholder='password' />
            <label htmlFor='pass2'>Password: </label>
            <input id="pass2" type="text" name="pass2" placeholder='retype password' />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='formSubmit' type="submit" value="sign in" />
        </form>
    );
};

//add all event listeners and set up defaults for the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    ReactDOM.render(<LogoWindow csrf={data.csrfToken} />,
            document.getElementById('logoLocation'));
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });
    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
    
};

window.onload = init;