#### A project to send JSON formatted messages to Apache Kafka with a producer and printing them on console with a consumer.

- Both producer and consumer has written in **JavaScript**.
- **Express.js** is used to create the API inside producer. 
- [wurstmeister/kafka](https://hub.docker.com/r/wurstmeister/kafka) and [zookeeper](https://hub.docker.com/_/zookeeper) images used for running kafka on docker.
- Both producer and consumer based on [node:18-alpine3.14](https://hub.docker.com/_/node) image.


<!-- ### Table of Contents
1. [Technologies](#Technologies) -->

### Steps to Run Project


1. Clone the repository
    ```bash
    git clone https://github.com/selmanadanir/kafka-app.git
    cd oss-kafka-app
    ```

2. Make sure that port **7777** is not used by another application then run docker-compose

    ```bash
    docker-compose up
    ```

### Sending and Receiving Messages

1. Send a POST request to API
    ```bash
    curl http://localhost:7777 -X POST -H "Content-Type: application/json" -d '{"key": "oss", "value": "test message"}' | json_pp 
    ```
2. Wait for Response from API
   ```json
   {
        "success" : "true",
        "message" : {
            "key" : "oss",
            "value" : "test message"
        }
    }
   ```
3. Check docker-compose output
   
   ```
    kafka-producer | Kafka-Producer: Message 'test message' sent successfully!
    kafka-consumer | New Message: {"key":"oss","value":"test message"}
   ```
# kafka-app
