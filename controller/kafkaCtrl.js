
var host = require('../controller/utils/host');

var socketCtrl = require('../controller/sockeCtrl');

exports.initKafka = initKafkaFn;


function initKafkaFn() {

// subscribe to a partitioned topic
// this topic can have a large number of partitions, but using kafkaesque,
// these can be split evenly between members of the group.
    var topics = [ 'rank'
        ,'warning_hour'
        ,'warning_day'
        ,'warning_week'
        ,'hour_lamp_cons'
        ,'day_lamp_cons'
        ,'week_lamp_cons'
        ,'hour_street_cons'
        ,'day_street_cons'
        ,'week_street_cons'
        ,'hour_city_cons'
        ,'day_city_cons'
        ,'week_city_cons'
        ,'warning_state'
        ,'median'
        ,'adjustment_data'];

    var kafkaTopics = [];
    for (var i = 0 ; i < topics.length ; i++){
        var topic = {};
        topic.topic = topics[i];
        topic.partition = 0;
        topic.time = -1;
        topic.maxNum = 1;
        kafkaTopics.push(topic)
    }
    var kafka = require('kafka-node'),
        Consumer = kafka.Consumer,
        client = new kafka.Client(host.zookeeperHost),
        offset = new kafka.Offset(client);

    offset.fetch(kafkaTopics, function (err, data) {
        var consumerTopics = [];
        for (var i = 0 ; i < kafkaTopics.length; i++){
            var topic = {};
            topic.topic = kafkaTopics[i].topic;
            topic.partition = 0;
            topic.offset = data[topic.topic][0][0];
            consumerTopics.push(topic);
        }
        var consumer = new Consumer(
            client,
            consumerTopics,
            {
                autoCommit: false,
                fromOffset: true
            }
        );
        consumer.on('message', function (message) {
            console.log("topic : " + message.topic);
            console.log("topic content: " + message.value);
            socketCtrl.emitOnTopic(message.topic,message.value);
        });
        consumer.on('error',function (error) {
            console.log(error);
        })
    });


}

