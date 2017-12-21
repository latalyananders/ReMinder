var login=document.getElementById("login");
login.addEventListener("click", function () {
    var email=document.getElementById("email");
    var pass=document.getElementById("pass");
    console.log(email.value);
    console.log(pass.value);
    var component = this;
    axios.get('/user', {
        params: {
            client_id: 2,
            client_secret: 'ix3eNBfVKmXun6Frtbui1K14ZsvCPtNKIKt1AbBv',
            grant_type: 'password',
            username: email.value,
            password: pass.value,
            scope: ''
        }
    })
        .then(function (response) {
            console.log(response);
        });
});