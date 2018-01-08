setInterval(function cycle() {
    library.query();
}, 3000)

chrome.notifications.onButtonClicked.addListener(function callbackD(notificationId,buttonIndex){
    if(buttonIndex==0){
        console.log("Выполнено")
        library.deleteTask(query.id)
    }else if(buttonIndex==1){
        console.log("Отложить")
        library.updateTask(query,60)
    }
});
