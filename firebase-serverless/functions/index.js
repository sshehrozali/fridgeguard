const functions = require("firebase-functions");
const { BigQuery } = require("@google-cloud/bigquery");
const axios = require("axios");

exports.createSensorData = functions.firestore
  .document("/data/{documentId}")
  .onCreate((snapshot, context) => {
    functions.logger.info("New sensor create request incoming...");
    console.log(snapshot.data());
    return Promise.resolve();
  });

exports.updateSensorData = functions.firestore
  .document("/data/{documentId}")
  .onUpdate(async (snapshot, context) => {
    functions.logger.warn("Sensor update request incoming...");

    const data = snapshot.after.data();
    if (!data.spoiled) {
      functions.logger.info("Spoiled food not detected.");
      return Promise.resolve();
    }

    functions.logger.warn(
      "Spoiled Food Detected. Exporting data to BigQuery..."
    );

    // Instantiate a new current timestamp
    const timestamp = new Date();

    // Make Axios POST request to Spring Kafka Client
    // URL: http://localhost:8080/api/v1/alerts/new
    // Produce new alert in Kafka topic
    // Return back
    // Continue perform write stream to BigQuery
    const options = {
      method: "POST",
      url: "http://localhost:8080/api/v1/alerts/new",
      data: {
        batchName: data.batch_name,
        bearcub: data.bearcub,
        alertReceivedAt: timestamp.toLocaleString(),
      },
    };
    axios
      .request(options)
      .then(function (response) {
        functions.logger.info("Alert log successfully published to Kafka");
      })
      .catch(function (error) {
        functions.logger.error("Error while publishing alert log in Kafka");
        functions.logger.error(error);
      });

    // Start stream operation to Google Cloud BigQuery
    // Create new BigQuery instance
    const bigquery = new BigQuery({
      keyFilename: "key.json",
      projectId: "airy-harbor-377319",
    });

    // Cook JSON schema
    const cookedData = {
      batch_name: data.batch_name,
      bearcub: data.bearcub,
      content: data.content,
      weight: data.weight,
      temperature: data.temperature,
      location: [{ longitude: data.location[0], latitude: data.location[1] }],
      date_start: data.date_start,
      producer: data.producer,
      last_timestamp: data.last_timestamp,
      spoiled: data.spoiled,
    };

    // Data to be exported
    console.log(cookedData);
    try {
      // Insert into BigQuery -> Write stream operation
      await bigquery.dataset("data").table("sensor").insert(cookedData);
      functions.logger.info("Data successfully exported");
    } catch (error) {
      // On error, log it
      functions.logger.error("Error while exporting data to BigQuery");
      functions.logger.error(error);
    }

    return Promise.resolve();
  });
