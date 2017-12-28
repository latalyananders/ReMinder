var log=document.getElementById("login");
log.addEventListener("click", function () {
    login();
    var email=document.getElementById("email");
    var pass=document.getElementById("pass");
    if(!isAuthenticated())
        axios.post('http://reminder.ddns.net/oauth/token', {
            client_id: 3,
            client_secret: 'GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk',
            grant_type: 'password',
            username: email.value,
            password: pass.value,
            scope: ''
        })
            .then(function (response) {
                setToken(response.data.access_token, response.data.expires_in + Date.now());
                startCheck();
            });
    else
        startCheck();
});

function isAuthenticated() {
    if(this.getToken())
        return true;
    else
        return false;
};

document.addEventListener('DOMContentLoaded', function(){
    
});

function setToken(token, expiration){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration);
};

function getToken() {
    var token = localStorage.getItem('token');
    var expiration = localStorage.getItem('expiration');
    if(!token||!expiration)
        return null;
    if(Date.now() > parseInt(expiration)){
        this.destroyToken();
        return null
    }
    return token
};

function destroyToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration')
};



function startCheck(){
    var title = document.getElementById("title");
    var description = document.getElementById("description");
    var date = document.getElementById("date");
    var component = this;
    setInterval(function cycle() {
    if (!component.enable)
        var autorisForm= document.getElementById("autorisForm");
        autorisForm.classList.add("inv");
        var taskForm= document.getElementById("taskForm");
        taskForm.classList.remove("inv");
        axios.get('http://reminder.ddns.net/api/tasks', {
            headers: {
                Authorization: "Bearer " + component.getToken()
            }
        })
            .then(function(response) {
                console.log(response);
                title.innerText=response.data[1].title;
                description.innerText=response.data[1].description;
                var offset = new Date().getTimezoneOffset();
                var dateObj=new Date(parseInt(response.data[1].date)+offset*60*1000);
                date.innerText=dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate()+" "+dateObj.getHours()+":"+dateObj.getMinutes();
            })

    }, 5000)
};

function login(){

    var email=document.getElementById("email");
    var pass=document.getElementById("pass");
    console.log(email.value);
    console.log(pass.value);
    axios.post('http://reminder.ddns.net//oauth/token', {
        client_id: 3,
        client_secret: 'GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk',
        grant_type: 'password',
        username: email.value,
        password: pass.value,
        scope: ''
    })
        .then(function (response) {
            setToken(response.data.access_token, response.data.expires_in + Date.now());
        });

    // axios.post('http://reminder.ddns.net/oauth/token', data)
    //     .then(function (response) {
    //         setToken(response.data.access_token, response.data.expires_in + Date.now())
    //     });
};

