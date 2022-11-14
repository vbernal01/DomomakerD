const helper = require('./helper.js');
const socket = io();
const checkIfValidColor = (strColor) => {
    let s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector("#domoAge").value;
    const color = e.target.querySelector("#domoColor").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if (!name || !age) {
        helper.handleError('All fields are required!');
        return false;
    }
    if (!checkIfValidColor(color)) {
        helper.handleError('Invalid color');
        return false;
    }

    socket.emit('addDomo', { name, age, _csrf, color });

    helper.sendPost(e.target.action, { name, age, _csrf, color }, loadDomosFromServer);

    return false;
}


const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="color">Color: </label>
            <input id="domoColor" type="text" name="color" placeholder="Domo Color" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo" style={{ backgroundColor: domo.color }}>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age} </h3>
            </div>
        )
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};


const communityDomoLoading = (domo) => {
    document.getElementById('communityDomos').innerHTML += `
    <div key=${domo._csrf} class="domo" style="background-color: ${domo.color}">
    <img src="/assets/img/domoface.jpeg" alt="domo face" class ="domoFace" />
    <h3 class="domoName">Name: ${domo.name} </h3>
    <h3 class="domoAge">Age: ${domo.age} </h3>
    </div> 
    `;
};


const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );
    socket.on('addDOM', communityDomoLoading);
    loadDomosFromServer();
}

window.onload = init;
