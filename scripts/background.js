var responseGlob;

setInterval(function cycle() {
    responseGlob = library.query();
}, 60000)


chrome.notifications.onButtonClicked.addListener(function callbackD(notificationId,buttonIndex){
    if(buttonIndex==0){
        console.log("Выполнено")
        library.deleteTask(responseGlob.data.id)
    }else if(buttonIndex==1){
        console.log("Отложить")
        library.updateTask(responseGlob.data,60)
    }

});
