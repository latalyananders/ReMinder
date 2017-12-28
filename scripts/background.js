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
            //var offset = new Date().getTimezoneOffset();
            /*offset=120;
            var displacement=0;
            if(offset>=0){
                displacement=(offset+240)*-1;
            }else{
                displacement=-240-offset;
            }
            var displacement= displacement*60*1000;*/
            //console.log(displacement);
            var dateObj=new Date(parseInt(response.data.date));
            var strDate=dateObj.getFullYear()+" "+(month[dateObj.getMonth()])+" "+dateObj.getDate()+" "+dateObj.getHours()+":"+dateObj.getMinutes();

            var notifOpt={
                type: "basic",
                iconUrl: "128.png",
                title: response.data.topic.name+" "+response.data.title,
                message: response.data.description+" "+strDate,
                buttons: [
                    { title: 'Выполнено' },
                    { title: 'Отложить' }
                ]}
            chrome.notifications.create("Notrif1",notifOpt) 
            
        }catch(err){
            console.log(err);
            console.log(notifOpt);
        }
        
        })
}, 2000)

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
function updateTask(id){
    axios.patch('http://reminder.ddns.net/api/tasks/'+id, {
    headers: {
        Authorization: "Bearer " + getToken()
    }
    })
        .then(function(response) {
            console.log(response);
        })
}
chrome.notifications.onButtonClicked.addListener(function callbackD(notificationId,buttonIndex){
    if(buttonIndex==0){
        console.log("Выполнено")
        deleteTask(responseGlob.data.id)
    }else if(buttonIndex==1){
        console.log("Отложить")
        updateTask(responseGlob.data.id)
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
