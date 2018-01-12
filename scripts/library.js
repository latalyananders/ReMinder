var library = function () {
    function getToken() {
        let token = localStorage.getItem('token');
        let expiration = localStorage.getItem('expiration');
        if(!token||!expiration)
            return null;
        if(Date.now() > parseInt(expiration)){
            this.destroyToken();
            return null
        }
        return token
    }

    function destroyToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration')
    }

    function isAuthenticated() {
        return !!this.getToken();
    }

    function setToken(token, expiration){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expiration);
    }

    function deleteTask(id){
        const url = 'http://reminder.ddns.net/api/tasks/' + id;
        const xhr = new XMLHttpRequest();

        xhr.open("DELETE", url, true);
        xhr.setRequestHeader('Authorization', "Bearer " + getToken());
        xhr.send(null);
    }

    function updateTask(data, minutes){
        let notif = new Date().getTime();
        notif += minutes * 60 * 1000;
        const url = 'http://reminder.ddns.net/api/tasks/' + data.id;
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Authorization', "Bearer " + getToken());
        xhr.setRequestHeader('notifyDate', notif.toString());
        xhr.send(null);
    }

    function query(notificate) {

        if(getToken() != null) {
            const url = 'http://reminder.ddns.net/api/query';
            const xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.setRequestHeader('Authorization', "Bearer " + getToken());
            xhr.onreadystatechange = function () {
                if (this.readyState !== 4) return;

                if (this.status === 200 && this.responseText) {
                    const response = JSON.parse(this.responseText);
                    window.query = response;
                    notificate(response);
                }
            };
            xhr.send(null);
        }
    }

    function login(login, password) {
        const url = 'http://reminder.ddns.net/oauth/token';
        const xhr = new XMLHttpRequest();
        const params = "client_id=3&client_secret=GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk&grant_type=password&scope=&username=" + login + "&password=" + password;

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        return xhr;
    }

    return{
        getToken,
        destroyToken,
        isAuthenticated,
        setToken,
        deleteTask,
        updateTask,
        query,
        login
    }
};

window.library = new library();
