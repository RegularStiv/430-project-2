//redirect the user ro the default place
const goBack = () =>{
    window.location.replace('/');
}

//render the go back button
const ReturnButton = (props) => {
    return (
        <button id="returnButton">Go Back</button>
    );
}

//rencer everything onto the screen
const init = async () => {
    ReactDOM.render(<ReturnButton />,
        document.getElementById('buttons'));
    document.getElementById('returnButton').onclick = goBack;
};

window.onload = init;