const kafka = require('kafka-node');
const HighLevelProducer = kafka.HighLevelProducer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;

const fs = require('fs');
var options = {
    logFile: './simple.log',
    endOfLineChar: require('os').EOL
};

// Obtain the initial size of the log file before we begin watching it.
var fileSize = fs.statSync(options.logFile).size;
fs.watchFile(options.logFile, function(current, previous) {
    // Check if file modified time is less than last time.
    // If so, nothing changed so don't bother parsing.
    if (current.mtime <= previous.mtime) {
        return;
    }

    // We're only going to read the portion of the file that
    // we have not read so far. Obtain new file size.
    var newFileSize = fs.statSync(options.logFile).size;
    // Calculate size difference.
    var sizeDiff = newFileSize - fileSize;
    // If less than zero then Hearthstone truncated its log file
    // since we last read it in order to save space.
    // Set fileSize to zero and set the size difference to the current
    // size of the file.
    if (sizeDiff < 0) {
        fileSize = 0;
        sizeDiff = newFileSize;
    }
    // Create a buffer to hold only the data we intend to read.
    var buffer = new Buffer(sizeDiff);
    // Obtain reference to the file's descriptor.
    var fileDescriptor = fs.openSync(options.logFile, 'r');
    // Synchronously read from the file starting from where we read
    // to last time and store data in our buffer.
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
    fs.closeSync(fileDescriptor); // close the file
    // Set old file size to the new size for next read.
    fileSize = newFileSize;

    // Parse the line(s) in the buffer.
    parseBuffer(buffer);
});

function stop() {
    fs.unwatchFile(options.logFile);
};


var brokerHost = 'localhost:2181'
    // var brokerHost =  'ec2-52-61-1-184.us-gov-west-1.compute.amazonaws.com:2181'
var clientId = 'my-client-id'
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

producer.on('ready', function() {});

// For this demo we just log producer errors to the console.
producer.on('error', function(error) {
    console.error(error);
});

function parseBuffer(buffer) {
    // Iterate over each line in the buffer.
    buffer.toString().split(options.endOfLineChar).forEach(function(line) {
        var payload = [{
            topic: 'test',
            messages: line,
            attributes: 1 /* Use GZip compression for the payload */
        }];
        producer.send(payload, function(error, result) {
            console.info('Sent payload to Kafka: ', payload);
            if (error) {
                console.error(error);
            } else {
                var formattedResult = result[0];
                console.log('result: ', result)
            }
        });
    });
};