setInterval(function cycle(){
    library.query(notificate);
}, 3000);

function notificate(response) {
    const month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь',
        'октябрь', 'ноябрь', 'декабрь'];

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
};

chrome.notifications.onButtonClicked.addListener(function callbackD(notificationId, buttonIndex){
    if(buttonIndex === 0){
        library.deleteTask(query.id)
        chrome.notifications.clear(notificationId);
    }else if(buttonIndex === 1){
        library.updateTask(query,60)
        chrome.notifications.clear(notificationId);
    }
});
