exports.setSocket = setSocketFn;

exports.emitOnTopic = emitOnTopicFn;

var sockets = [];

var socket = null;

function setSocketFn(newSocket) {
    if (!socket)
        socket = newSocket;
    if (sockets.indexOf(newSocket) === -1)
        sockets.push(newSocket);
}


function emitOnTopicFn(topic,message) {

    if (socket){
        socket.broadcast.emit(topic, {
            message: message
        });
    }
    else{
        socket = sockets[0];
        socket.broadcast.emit(topic, {
            message: message
        });
    }


}