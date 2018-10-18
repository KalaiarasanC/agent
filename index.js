const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const kafka = require('kafka-node');
const HighLevelProducer = kafka.HighLevelProducer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;

const port = 8000;
// const brokerHost = 'localhost:2181';
// const brokerHost =  'ec2-52-61-1-184.us-gov-west-1.compute.amazonaws.com:2181'

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hey you , its me agent');
})

app.post('/agent/log', (req, res) => {
    var brokerHost = 'ec2-52-61-1-184.us-gov-west-1.compute.amazonaws.com:2181'
    var clientId = "test-client-id";
    var client = new Client(brokerHost, clientId, {
        sessionTimeout: 300,
        spinDelay: 100,
        retries: 2
    });


    // For this demo we just log client errors to the console.
    client.on('error', function(error) {
        console.error(error);
    });

    var producer = new HighLevelProducer(client);

    producer.on('ready', function() {
        var payload = [{
            topic: 'test',
            messages: req.body,
            attributes: 1 /* Use GZip compression for the payload */
        }];
        producer.send(payload, function(error, result) {
            console.info('Sent payload to Kafka: ', payload);
            if (error) {
                console.error(error);
                res.status(500).send(error)
            } else {
                var formattedResult = result[0];
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