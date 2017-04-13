exports.setSocket = setSocketFn;

exports.emitOnTopic = emitOnTopicFn;

var sockets = [];

var socket = null;

function setSocketFn(newSocket) {
    if (!socket)
        socket = newSocket;
}


function emitOnTopicFn(topic,message) {

    if (socket){
        socket.broadcast.emit(topic, {
            message: message
        });
    }


}