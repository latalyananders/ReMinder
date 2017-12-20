var app = new Vue({
    el: '#app',
    data: {
        client_id: 2,
        client_secret: 'ix3eNBfVKmXun6Frtbui1K14ZsvCPtNKIKt1AbBv',
        grant_type: 'password',
        username : 'isl23@mail.ru',
        password: '123456',
        scope: ''
    },
    created: function() {
        var component = this;
        if(component.isAuthenticated()){
            console.log('Вы уже авторизованы, вы молодец С:');
            return;
        }
        var data = {
            client_id: 2,
            client_secret: 'ix3eNBfVKmXun6Frtbui1K14ZsvCPtNKIKt1AbBv',
            grant_type: 'password',
            username: this.username,
            password: this.password,
            scope: ''
        };
        axios.post('http://reminder.ddns.net/oauth/token', data)
            .then(function (response) {
                component.setToken(response.data.access_token, response.data.expires_in + Date.now());

                axios.get('http://reminder.ddns.net/api/checkauth', {
                    headers: {
                        Authorization: "Bearer " + component.getToken()
                    }
                })
                    .then(function(response) {
                        console.log(response);
                    })
            })
    },
    methods:{
        setToken(token, expiration){
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expiration);
        },
        getToken() {
            var token = localStorage.getItem('token');
            var expiration = localStorage.getItem('expiration');
            if(!token||!expiration)
                return null;
            if(Date.now() > parseInt(expiration)){
                this.destroyToken();
                return null
            }
            return token
        },
        destroyToken() {
            localStorage.removeItem('token');
            localStorage.removeItem('expiration')
        },
        isAuthenticated() {
            if (this.getToken())
                return true;
            else
                return false;
        },
        login() {
            var component = this;
            var data = {
                client_id: 2,
                client_secret: 'ix3eNBfVKmXun6Frtbui1K14ZsvCPtNKIKt1AbBv',
                grant_type: 'password',
                username : this.username,
                password: this.password,
                scope: ''
            };
            console.log('Я был тут');
            axios.post('http://reminder.ddns.net/oauth/token', data)
                .then(function (response) {
                    component.setToken(response.data.access_token, response.data.expires_in + Date.now());
                    axios.get('http://reminder.ddns.net/api/checkauth', {
                        headers: {
                            Authorization: "Bearer " + component.getToken()
                        }
                    })
                        .then(function(response) {
                            console.log(response);
                            if(response.statusText == 'OK'){
                                console.log('оки-доки');
                            }
                            else{
                                console.log('не оки-доки :С')
                            }
                        })
                })
        }
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    app.enable = !app.enable;
    if(app.enable) alert('Напоминалка активирована!');
    else alert('Напоминалка деактивированна');
});