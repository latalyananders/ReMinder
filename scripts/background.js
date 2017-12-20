var app = new Vue({
    data: {
        url: 'http://reminder.ddns.net/api/checkauth',
        enable: true,
        username : 'isl23@mail.ru',
        password: '123456'
    },
    created: function() {

        var component = this;

        var data = {
            client_id: 2,
            client_secret: 'ix3eNBfVKmXun6Frtbui1K14ZsvCPtNKIKt1AbBv',
            grant_type: 'password',
            username: this.username,
            password: this.password,
            scope: ''
        };

        if(!component.isAuthenticated())
            axios.post('http://reminder.ddns.net/oauth/token', data)
                .then(function (response) {
                    component.setToken(response.data.access_token, response.data.expires_in + Date.now())
                    component.startCheck();
                });
        else
            component.startCheck();
    },
    methods:{
        setToken(token, expiration){
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expiration);
        },

        getToken() {
            var token = localStorage.getItem('token')
            var expiration = localStorage.getItem('expiration')
            if(!token||!expiration)
                return null
            if(Date.now() > parseInt(expiration)){
                this.destroyToken()
                return null
            }
            return token
        },

        destroyToken() {
            localStorage.removeItem('token')
            localStorage.removeItem('expiration')
        },

        isAuthenticated() {
            if(this.getToken())
                return true;
            else
                return false;
        },

        startCheck(){
            component = this;
            console.log(this);
            setInterval(function cycle() {
                if (component.enable)
                    axios.get('http://reminder.ddns.net/api/query', {
                        headers: {
                            Authorization: "Bearer " + component.getToken()
                        }
                    })
                        .then(function(response) {
                            console.log(response);
                        })

            }, 5000)
        },

        login(){
            axios.post('http://reminder.ddns.net/oauth/token', data)
                .then(function (response) {
                    component.setToken(response.data.access_token, response.data.expires_in + Date.now())
                });
        }
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    app.enable = !app.enable;
    if(app.enable) alert('Напоминалка активирована!');
    else alert('Напоминалка деактивированна');
});