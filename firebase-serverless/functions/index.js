const functions = require("firebase-functions");
const { BigQuery } = require("@google-cloud/bigquery");

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

    console.log(cookedData);

    const stream = [cookedData];
    try {
      // Insert into BigQuery
      await bigquery.dataset("data").table("sensor").insert(cookedData);
      functions.logger.info("Data successfully exported");
    } catch (error) {
      functions.logger.error("Error while exporting data to BigQuery");
      functions.logger.error(error);
    }

    return Promise.resolve();
  });
