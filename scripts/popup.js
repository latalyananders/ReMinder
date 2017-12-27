var log=document.getElementById("login");
log.addEventListener("click", function () {
    var email=document.getElementById("email");
    var pass=document.getElementById("pass");
    console.log(email.value);
    console.log(pass.value);
    axios.post('http://95.68.204.234//oauth/token', {
            client_id: 3,
            client_secret: 'GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk',
            grant_type: 'password',
            username: email.value,
            password: pass.value,
            scope: ''
    })
        .then(function (response) {
            console.log(response.data);
        });
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
        axios.post('http://95.68.204.234/oauth/token', {
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
            axios.get('http://95.68.204.234/api/query', {
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
    axios.post('http://95.68.204.234/oauth/token', data)
        .then(function (response) {
            setToken(response.data.access_token, response.data.expires_in + Date.now())
        });
};
