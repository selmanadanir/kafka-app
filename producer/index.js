const express = require('express');
const {Kafka} = require('kafkajs');
const bodyParser = require('body-parser');

// Creating express app
const app = express();
const PORT = 3000;

// express.js' bodyParser middleware
app.use(express.json());

// global variables
let producer;
let timeout;

//Function to connect message broker
const connectKafka = async() => {
    try {
        const kafka = new Kafka({
            "clientId": "myapp",
            "brokers": ["kafka:9092"]
        });
        
        producer = kafka.producer();
        console.log("Kafka-Producer: Connecting...");
        await producer.connect();
        console.log("Kafka-Producer: Connected!");
        
        // Set timeout if connection successful.
        timeout = setTimeout(async() => {
            await producer.disconnect();
            producer = null;
            console.log("INFO: Producer disconnected due to timeout.");
        }, 60000); // If there is no request for 60 secs, producer disconnects.
    }

    catch(ex) {
        console.log(`Producer Error: ${ex}`);
    }
}

connectKafka(); // Connect when app started

/**
 * Function to send messages to broker
 * @param {String} msg Message to send
 */
const sendMessage = async(msg) => {
    try {
        await producer.send({
            "topic": "OSS",
            "messages": [{
                "key": msg.key,
                "value": JSON.stringify(msg)
            }]
        });

        console.log(`Kafka-Producer: Message '${msg.value}' sent successfully!`);
    }

    catch(ex) {
        console.log(`Producer Error: ${ex}`);
    }
}

// Get request to http://host:port/
app.get('/', (req, res) => {
    res.send('You need to send POST request in order to add message.');
});

// Post request to http://host:port/
app.post('/', async(req, res) => {
    const message = req.body; // get request body
    
    // if producer disconnected
    if(!producer) {
        await connectKafka();
    }

    // reset timeout if producer is already connected
    else {
        clearTimeout(timeout);
        timeout = setTimeout(async() => {
            await producer.disconnect();
            producer = null;
            console.log("INFO: Producer disconnected due to timeout.");
        }, 60000);
    }

    await sendMessage(message);
    
    // send response if message sended to broker
    res.json({
        success: 'true',
        message
    });
});

app.listen(PORT, () => {
    console.log(`Kafka-Producer: App listening at http://localhost:${PORT}`);
});