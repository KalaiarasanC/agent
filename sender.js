function sendLogs(data) {
    console.log('data', data);
    // Build the post string from an object
    var post_data = data;

    // An object of options to indicate where to post to
    var post_options = {
        host: 'localhost',
        port: '8000',
        path: '/agent/log',
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': Buffer.byteLength(post_data)
        },

    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}
module.exports.sendLogs = sendLogs;
// sendLogs(JSON.stringify({ "eventVersion": "1.04", "userIdentity": { "type": "IAMUser", "principalId": "AIDAKUDUA4RMSXV7JYGTY", "arn": "arn:aws-us-gov:iam::390645227433:user/nick@quzara.com", "accountId": "390645227433", "accessKeyId": "ASIAVV5CFD6U7JJN6J7K", "userName": "nick@quzara.com", "sessionContext": { "attributes": { "mfaAuthenticated": "true", "creationDate": "2018-10-25T15:28:01Z" } }, "invokedBy": "AWS Internal" }, "eventTime": "2018-10-25T18:50:42Z", "eventSource": "monitoring.amazonaws.com", "eventName": "DescribeAlarms", "awsRegion": "us-gov-west-1", "sourceIPAddress": "AWS Internal", "userAgent": "AWS Internal", "errorCode": "ValidationException", "errorMessage": "1 validation error detected: Value \u0027INVALID_FOR_SUMMARY\u0027 at \u0027stateValue\u0027 failed to satisfy constraint: Member must satisfy enum value set: [INSUFFICIENT_DATA, ALARM, OK]", "requestParameters": { "stateValue": "INVALID_FOR_SUMMARY" }, "responseElements": null, "requestID": "df92ff13-d886-11e8-9ba7-e99c3e93bcd1", "eventID": "438fcf42-160f-4cb6-bada-6cc7ec5b57da", "eventType": "AwsApiCall", "recipientAccountId": "390645227433" }));