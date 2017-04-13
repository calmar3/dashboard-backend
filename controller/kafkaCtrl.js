// create a kafkaesqe client, providing at least one broker



var socketCtrl = require('../controller/sockeCtrl');
var sub_topics=[];

exports.initKafka = initKafkaFn;


function initKafkaFn() {

// subscribe to a partitioned topic
// this topic can have a large number of partitions, but using kafkaesque,
// these can be split evenly between members of the group.


    var topics = [ 'rank','warning_hour'
    ,'warning_day'
    ,'warning_hour'
    ,'warning_week'
    ,'hour_lamp_cons'
    ,'day_lamp_cons'
    ,'week_lamp_cons'
    ,'hour_street_cons'
    ,'day_street_cons'
    ,'week_street_cons'
    ,'hour_city_cons'
    ,'day_city_cons'
    ,'week_city_cons'];


    for (var i = 0 ; i < topics.length ; i++){
        subscribeAndListen(topics[i]);
    }


}

function subscribeAndListen(topic) {

    var kafkaesque = require('kafkaesque')({
        brokers: [{host: 'localhost', port: 9092}]
    });
    kafkaesque.subscribe(topic);

/*    console.log(topic);*/
    kafkaesque.connect(function (err, kafka) {
        if (err) {
            console.log(err);
        }
        // handle each message
        kafka.on('message', function(message, commit) {
            // once a message has been successfull handled, call commit to advance this
            // consumers position in the topic / parition
/*            console.log(topic);
            console.log(message);*/
            socketCtrl.emitOnTopic("rank",message.value);
            commit();
        });




        // report errors
        kafka.on('error', function(error) {
            console.log(error);
        });
    });
// connect gives a nice EventEmitter interface for receiving messages

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

