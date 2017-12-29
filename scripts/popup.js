var log=document.getElementById("login");
log.addEventListener("click", function () {
    login();

});

var logout=document.getElementById("logout");
logout.addEventListener("click", function () {
    library.destroyToken();
    document.getElementById("notAuth").style.display = 'inherit';
    document.getElementById("Auth").style.display = 'none';
});

var redirect=document.getElementById("redirect");
redirect.addEventListener("click", function () {
    window.open("http://reminder.ddns.net/tasks/create");
});

document.addEventListener('DOMContentLoaded', function(){
    var email=document.getElementById("email");
    var pass=document.getElementById("pass");
    if(!library.isAuthenticated())
        axios.post('http://reminder.ddns.net/oauth/token', {
            client_id: 3,
            client_secret: 'GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk',
            grant_type: 'password',
            username: email.value,
            password: pass.value,
            scope: ''
        })
            .then(function (response) {
                library.setToken(response.data.access_token, response.data.expires_in + Date.now());
            });
    else{
        document.getElementById("notAuth").style.display = 'none';
        document.getElementById("Auth").style.display = 'inherit';
    }
});


function login(){
    var email=document.getElementById("email");
    var pass=document.getElementById("pass");
    axios.post('http://reminder.ddns.net/oauth/token', {
        client_id: 3,
        client_secret: 'GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk',
        grant_type: 'password',
        username: email.value,
        password: pass.value,
        scope: ''
    })
        .then(function (response) {
            library.setToken(response.data.access_token, response.data.expires_in + Date.now());
            document.getElementById("message").style.display = 'none';
            document.getElementById("notAuth").style.display = 'none';
            document.getElementById("Auth").style.display = 'inherit';
        })
        .catch(function () {
            document.getElementById("message").style.display = 'inherit';
    })
};

