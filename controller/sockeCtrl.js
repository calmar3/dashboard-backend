exports.setSocket = setSocketFn;

exports.emitOnTopic = emitOnTopicFn;

var sockets = [];

var socket = null;

/**
 * set socket of controller
 * @param newSocket
 */
function setSocketFn(newSocket) {
    if (!socket)
        socket = newSocket;
    if (sockets.indexOf(newSocket) === -1)
        sockets.push(newSocket);
}

/**
 * broadcast messages received from KakfCtrl to all clients on the right topic
 * @param topic
 * @param message
 */
function emitOnTopicFn(topic,message) {

    if (socket){
        socket.broadcast.emit(topic, {
            message: message
        });
    }
}