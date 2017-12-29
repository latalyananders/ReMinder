var responseGlob;

setInterval(function cycle() {
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
                }
        })
}, 3000)

function deleteTask(id){
    axios.delete('http://reminder.ddns.net/api/tasks/'+id, {
        headers: {
            Authorization: "Bearer " + getToken()
        }
    })
        .then(function(response) {
            console.log(response);
        })
}

function updateTask(data,minutes){
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
}

chrome.notifications.onButtonClicked.addListener(function callbackD(notificationId,buttonIndex){
    if(buttonIndex==0){
        console.log("Выполнено")
        deleteTask(responseGlob.data.id)
    }else if(buttonIndex==1){
        console.log("Отложить")
        updateTask(responseGlob.data,60)
    }

});
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