const { Kafka } = require("kafkajs");

getMessages();

/**
 * Function to get messages from message broker
 */
async function getMessages() {
    try {
        const kafka = new Kafka({
            clientId: "myapp",
            brokers: ["kafka:9092"],
        });

        // groupId is required
        const consumer = kafka.consumer({ groupId: "consumers", rebalanceTimeout: 1000 });
        console.log("Kafka Consumer: Connecting...");
        await consumer.connect();
        console.log("Kafka Consumer: Connected!");

        // subscribe to get messages from related topic
        await consumer.subscribe({
            topic: "OSS",
            fromBeginning: true // start reading messages from beginning
        });

        // start listening for messages and print each message on console
        await consumer.run({
            eachMessage: async (result) => {
                console.log(
                    `New Message: ${JSON.stringify({
                        key: result.message.key.toString(),
                        value: JSON.parse(result.message.value).value
                    })}`
                );
            },
        });
    } catch (ex) {
        console.log(`Consumer Error: ${ex}`);
    }
}
