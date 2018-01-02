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
    };

    function destroyToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration')
    };

    function isAuthenticated() {
        if(this.getToken())
            return true;
        else
            return false;
    };

    function setToken(token, expiration){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expiration);
    };

    function deleteTask(id){
        axios.delete('http://reminder.ddns.net/api/tasks/'+id, {
            headers: {
                Authorization: "Bearer " + getToken()
            }
        })
            .then(function(response) {
                console.log(response);
            })
    };

    function updateTask(data, minutes){
        var notif= new Date().getTime();
        notif=parseInt(notif)+minutes*60*1000;
        axios({
            method: 'put',
            url: 'http://reminder.ddns.net/api/tasks/'+data.id,
            headers: {
                Authorization: "Bearer " + getToken(),
                notifyDate: notif
            }
        })
            .then(function(response) {
                console.log(response);
                console.log(data.notify_date)
            });
    };

    function query() {
        var month =['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь',
            'октябрь','ноябрь','декабрь'];
        var notifOpt;
        if(getToken() != null)
            axios.get('http://reminder.ddns.net/api/query', {
                headers: {
                    Authorization: "Bearer " + getToken()
                }
            })
                .then(function(response) {
                    if(response.data != "")
                        try{
                            console.log(response);
                            responseGlob=response;
                            var dateObj=new Date(parseInt(response.data.notify_date));
                            var hours=dateObj.getHours();
                            if(hours<10)
                                hours="0"+hours;
                            var minutes=dateObj.getMinutes();
                            if(minutes<10)
                                minutes="0"+minutes;
                            var strDate=dateObj.getFullYear()+" "+(month[dateObj.getMonth()])+" "+dateObj.getDate()+" "+hours+":"+minutes;

                            var description = "";
                            if(response.data.description!=null)
                                description = response.data.description;

                            var notifOpt={
                                type: "basic",
                                iconUrl: "128.png",
                                title: response.data.topic.name+": "+response.data.title,
                                message: description+" "+strDate,
                                buttons: [
                                    { title: 'Выполнено' },
                                    { title: 'Отложить' }
                                ]}
                            chrome.notifications.create("Notrif1",notifOpt)
                            return response;
                        }catch(err){
                            var description = "";
                            if(response.data.description != null)
                                description = response.data.description;
                            var notifOpt={
                                type: "basic",
                                iconUrl: "128.png",
                                requireInteraction : true,
                                title: response.data.topic.name+": "+response.data.title,
                                message: description+" "+strDate,
                                buttons: [
                                    { title: 'Выполнено' },
                                    { title: 'Отложить на час' }
                                ]}
                            chrome.notifications.create("notifRegul",notifOpt)
                            return response;

                        }
                })
    };

    function login(login, password) {
        return axios.post('http://reminder.ddns.net/oauth/token', {
            client_id: 3,
            client_secret: 'GWxj9V3I0GpLaUUzcPMug2qxrqxePTn4PAOjhnmk',
            grant_type: 'password',
            username: login,
            password: password,
            scope: ''
        })
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
