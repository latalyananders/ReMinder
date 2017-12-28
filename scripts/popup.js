var log=document.getElementById("login");
log.addEventListener("click", function () {
    login();

});

var logout=document.getElementById("logout");
logout.addEventListener("click", function () {
    destroyToken();
    document.getElementById("notAuth").style.display = 'inherit';
    document.getElementById("Auth").style.display = 'none';
});

var redirect=document.getElementById("redirect");
redirect.addEventListener("click", function () {
    window.open("http://reminder.ddns.net/tasks/create");
});

function isAuthenticated() {
    if(this.getToken())
        return true;
    else
        return false;
};

document.addEventListener('DOMContentLoaded', function(){
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
    else{
        startCheck();
        document.getElementById("notAuth").style.display = 'none';
        document.getElementById("Auth").style.display = 'inherit';
    }
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
    setInterval(function cycle() {
            axios.get('http://reminder.ddns.net/api/query', {
                headers: {
                    Authorization: "Bearer " + getToken()
                }
            })
                .then(function(response) {
                    console.log(response.data);
                })

    }, 5000)
};

function login(){

    var email=document.getElementById("email");
    var pass=document.getElementById("pass");
    console.log(email.value);
    console.log(pass.value);
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
            document.getElementById("message").style.display = 'none';
            document.getElementById("notAuth").style.display = 'none';
            document.getElementById("Auth").style.display = 'inherit';
        })
        .catch(function () {
            document.getElementById("message").style.display = 'inherit';
    })
};

