setInterval(function cycle(){
    library.query();
}, 3000)

chrome.notifications.onButtonClicked.addListener(function callbackD(notificationId,buttonIndex){
    if(buttonIndex === 0){
        library.deleteTask(query.id)
    }else if(buttonIndex === 1){
        library.updateTask(query,60)
    }
});
