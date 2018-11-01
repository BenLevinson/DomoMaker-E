const handleDomo = (e) => {
  e.preventDefault();
  $("#domoMessage").animate({width:'hide'},350);
  if ($("#domoName").val() === '' || $("#domoAge").val() === '' || $("#domoLevel").val() === '') {
    handleError("All fields are required.");
    return false;
  }
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer();
  });
  return false;
};

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
    <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
    <label htmlFor="level">Level: </label>
    <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="makeDomoSubmit" type="submit" value="Make Domo" />
  </form>
  );
};

const DomoList = function(props) {
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }
  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className="domo" id={domo._id}>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h4 className="domoLevel"> Lvl: {domo.level} </h4>
        <h3 className="domoName"> Name: {domo.name} </h3>
        <h3 className="domoAge"> Age: {domo.age} </h3>
      </div>
    );
  });
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
  const domoClass = document.getElementsByClassName('domo');
  ReactDOM.render(<h3>Clear Domos</h3>, document.querySelector("#clearDiv"));
  document.querySelector("#clearDiv").addEventListener('click', (e) => {
    e.preventDefault();
    sendAjax('GET', '/clearDomos', null, (data) => {
      for(let i = 0; i < domoClass.length; i++) {
        domoClass[i].style.display = "none";
        ReactDOM.render(<h3 className="emptyDomo">No Domos yet</h3>, document.querySelector("#domos"));
      }
    }); 
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
  ReactDOM.render(
    <DomoForm domos={[]} />, document.querySelector("#domos")
  );
  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken(); 
});
