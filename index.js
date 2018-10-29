const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const kafka = require('kafka-node');
const HighLevelProducer = kafka.HighLevelProducer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;
const utf8 = require('utf8');
const port = 8000;
// runningon 52.61.251.184
// broker : 52.61.1.184
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hey you , its me agent');
})

app.post('/agent/test', (req, res) => {
    // console.log('res', req.body);
    res.status(200).send('gotIt');
});

app.post('/agent/log', (req, res) => {
    console.log('coming', req.body);
    // var brokerHost = 'localhost:2181'
    // const brokerHost = 'ec2-52-61-1-184.us-gov-west-1.compute.amazonaws.com:2181'
    const brokerHost = '52.61.1.184:2181'
    const clientId = "test-client-id";
    const topic = 'test';
    const client = new Client(brokerHost, clientId, {
        sessionTimeout: 300,
        spinDelay: 100,
        retries: 2
    });

    // For this demo we just log client errors to the console.
    client.on('error', function(error) {
        console.error(error);
    });

    var producer = new HighLevelProducer(client);
    const encodedData = req.body.content;

    producer.on('ready', function() {
        var payload = [{
            topic: topic,
            messages: encodedData,
            attributes: 1 /* Use GZip compression for the payload */
        }];
        producer.send(payload, function(error, result) {
            console.info('Sent payload to Kafka: ', payload);
            if (error) {
                console.error(error);
                res.status(500).send(error)
            } else {
                console.log('result: ', result)
                res.sendStatus(200);
            }
        });
    });

    // For this demo we just log producer errors to the console.
    producer.on('error', function(error) {
        console.error(error);
    });
})

app.listen(port, () => {
    console.log('Agent listening at ' + port + ' ....')
})