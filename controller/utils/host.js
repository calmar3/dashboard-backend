/**
 * local controller to make create-delete over lamp
 * zookeeper host to subscribe kafka topic
 * @type {{localController: string, zookeeperHost: string}}
 */
var properties = {
    "localController": "http://local-controller.mybluemix.net",
    "zookeeperHost": '54.152.81.214:2181'
};
module.exports = properties;
