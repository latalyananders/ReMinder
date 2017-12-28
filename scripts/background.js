var responseGlob;
console.log("Privet");
setInterval(function cycle() {
    var month =['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь',
    'октябрь','ноябрь','декабрь']
    var notifOpt
    axios.get('http://reminder.ddns.net/api/query', {
        headers: {
            Authorization: "Bearer " + getToken()
        }
    })
        .then(function(response) {
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
                var notifOpt={
                    type: "basic",
                    iconUrl: "128.png",
                    title: response.data.topic.name+": "+response.data.title,
                    message: response.data.description+" "+strDate,
                    buttons: [
                        { title: 'Выполнено' },
                        { title: 'Отложить' }
                    ]}
                chrome.notifications.create("Notrif1",notifOpt) 
                
            }catch(err){
                console.log(err);
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

function updateTask(data){
    var notif=data.notify_date;
    console.log(data.minuts);
    notif=parseInt(notif)+data.minuts*60*1000;
    console.log(notif);
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
        updateTask(responseGlob.data)
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
