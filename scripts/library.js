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

    function query() {
        const month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь',
            'октябрь', 'ноябрь', 'декабрь'];
        if(getToken() != null) {
            const url = 'http://reminder.ddns.net/api/query';
            const xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.setRequestHeader('Authorization', "Bearer " + getToken());
            xhr.onreadystatechange = function () {
                if (this.readyState !== 4) return;

                if (this.status === 200 && this.responseText) {
                    const response = JSON.parse(this.responseText);

                    const dateObj = new Date(parseInt(response.notify_date));
                    let hours = dateObj.getHours();
                    if (hours < 10)
                        hours = "0" + hours;
                    let minutes = dateObj.getMinutes();
                    if (minutes < 10)
                        minutes = "0" + minutes;
                    const strDate = dateObj.getFullYear() + " " + (month[dateObj.getMonth()]) + " " + dateObj.getDate() + " " + hours + ":" + minutes;

                    let description = "";
                    if (response.description != null)
                        description = response.description;

                    const notifOpt = {
                        type: "basic",
                        iconUrl: "128.png",
                        title: response.topic.name + ": " + response.title,
                        message: description + " " + strDate,
                        buttons: [
                            {title: 'Выполнено'},
                            {title: 'Отложить'}
                        ]
                    };
                    chrome.notifications.create("Notrif1", notifOpt, function () {});

                    window.query = response;
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
