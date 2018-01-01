document.getElementById("login").addEventListener("click", function () {
    library.login(document.getElementById("email").value, document.getElementById("pass").value)
        .then((response) =>{
            library.setToken(response.data.access_token, response.data.expires_in + Date.now());
            document.getElementById("message").style.display = 'none';
            document.getElementById("notAuth").style.display = 'none';
            document.getElementById("Auth").style.display = 'inherit';
        })
        .catch(err => {
            document.getElementById("message").style.display = 'inherit';
        });
});

document.getElementById("logout").addEventListener("click", function () {
    library.destroyToken();
    document.getElementById("notAuth").style.display = 'inherit';
    document.getElementById("Auth").style.display = 'none';
});

document.getElementById("redirect").addEventListener("click", function () {
    window.open("http://reminder.ddns.net/tasks/create");
});

document.getElementById("logo").addEventListener("click", function(){
    window.open('http://reminder.ddns.net')
});

document.addEventListener('DOMContentLoaded', function(){
    if(!library.isAuthenticated()) {
        document.getElementById("notAuth").style.display = 'inherit';
        document.getElementById("Auth").style.display = 'none';
    }
    else{
        document.getElementById("notAuth").style.display = 'none';
        document.getElementById("Auth").style.display = 'inherit';
    }
});
