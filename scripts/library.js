var library = function () {
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
    }

    function destroyToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration')
    }

    function isAuthenticated() {
        if(this.getToken())
            return true;
        else
            return false;
    }

    function setToken(token, expiration){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expiration);
    }

    function deleteTask(id){
        var url = 'http://reminder.ddns.net/api/tasks/' + id;
        var xhr = new XMLHttpRequest();

        xhr.open("DELETE", url, true);
        xhr.setRequestHeader('Authorization', "Bearer " + getToken());
        xhr.send(null);
    }

    function updateTask(data, minutes){
        var notif= new Date().getTime();
        notif = parseInt(notif) + minutes * 60 * 1000;
        var url = 'http://reminder.ddns.net/api/tasks/'+data.id;
        var xhr = new XMLHttpRequest();

        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Authorization', "Bearer " + getToken());
        xhr.setRequestHeader('notifyDate', notif);
        xhr.send(null);
    }

    function query() {
        var month = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь',
            'октябрь','ноябрь','декабрь'];
        var notifOpt;
        if(getToken() != null) {
            var url = 'http://reminder.ddns.net/api/query';
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.setRequestHeader('Authorization', "Bearer " + getToken());
            xhr.onreadystatechange = function () {
                if (this.readyState != 4) return;

                if (this.status == "200" && this.responseText) {
                    var response = JSON.parse(this.responseText);

                    var dateObj = new Date(parseInt(response.notify_date));
                    var hours = dateObj.getHours();
                    if (hours < 10)
                        hours = "0" + hours;
                    var minutes = dateObj.getMinutes();
                    if (minutes < 10)
                        minutes = "0" + minutes;
                    var strDate = dateObj.getFullYear() + " " + (month[dateObj.getMonth()]) + " " + dateObj.getDate() + " " + hours + ":" + minutes;

                    var description = "";
                    if (response.description != null)
                        description = response.description;

                    var notifOpt = {
                        type: "basic",
                        iconUrl: "128.png",
                        title: response.topic.name + ": " + response.title,
                        message: description + " " + strDate,
                        buttons: [
                            {title: 'Выполнено'},
                            {title: 'Отложить'}
                        ]
                    }
                    chrome.notifications.create("Notrif1", notifOpt)
                    window.query = response;
                }
            };
            xhr.send(null);
        }
    }

    function login(login, password) {
        var url = 'http://reminder.ddns.net/oauth/token';
        var xhr = new XMLHttpRequest();
        var params = "client_id=3&client_secret=GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk&grant_type=password&scope=&username="+login+"&password="+password;

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
