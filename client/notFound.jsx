const goBack = () =>{
    window.location.replace('/');
}

const ReturnButton = (props) => {
    return (
        <button id="returnButton">Go Back</button>
    );
}

const init = async () => {
    ReactDOM.render(<ReturnButton />,
        document.getElementById('buttons'));
    document.getElementById('returnButton').onclick = goBack;
};

window.onload = init;