const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.post("/event", async (req, res) => {
    try {
        const driving_events = JSON.parse(fs.readFileSync("./driving_events.json", "utf8"));
        const thresholds = JSON.parse(fs.readFileSync("./thresholds.json", "utf8"));
        const alerts = JSON.parse(fs.readFileSync("./alerts.json", "utf8"));
        const { timestamp, is_driving_safe, vehicle_id, location_type } = req.body;

        if(driving_events.hasOwnProperty(vehicle_id)) {
            driving_events[vehicle_id].push({is_driving_safe, timestamp, location_type});
        } else {
            driving_events[vehicle_id] = [{is_driving_safe, timestamp, location_type}];
        }

        fs.writeFileSync("./driving_events.json", JSON.stringify(driving_events, null, 4));

        const alertsCorrespondingToThisVehicleId = Object.values(alerts).filter(alert => alert.vehicle_id == vehicle_id);

        const hasAnAlertInLastFiveMinutes = alertsCorrespondingToThisVehicleId.filter(alert => new Date(timestamp) - new Date(alert.timestamp) < 5 * 60 * 1000).length > 0;

        if(hasAnAlertInLastFiveMinutes) {
            return res.status(200).json({
                status: "success",
                info: "Event successfully recorded"
            });
        }
        
        const lastFiveDrivingEventsForTheGivenVehicle = driving_events[vehicle_id].slice(-5);
        const regionTypes = Object.keys(thresholds);
        let thresholdsCrossed = regionTypes.reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {});
        lastFiveDrivingEventsForTheGivenVehicle.forEach(drivingEvent => {
            thresholdsCrossed[drivingEvent.location_type] += drivingEvent.is_driving_safe ? 0 : 1;
        });
        let alertCreated = false;
        Object.entries(thresholdsCrossed).forEach(([location_type, violation_count]) => {
            if(violation_count >= thresholds[location_type]) {
                alertCreated = true;
                const alert_id_int = Object.keys(alerts).length+1
                const alert_id     = alert_id_int.toString()
                alerts[alert_id] = {
                    vehicle_id: vehicle_id,
                    timestamp: timestamp,
                    location_type: location_type
                };
            }
        });

        fs.writeFileSync("./alerts.json", JSON.stringify(alerts, null, 4));
        if(alertCreated)
        res.status(200).json({
            status: "success",
            info: "Event successfully recorded and alert is created"
        });
        else
        res.status(200).json({
            status: "success",
            info: "Event successfully recorded"
        });

    } catch(err) {
        res.status(500).json({
            status: "error",
            info: "An unknown error occured, please try again later"
        });
    }
});

app.get("/alert/:alert_id", (req, res) => {
    try {
        const alerts = JSON.parse(fs.readFileSync("./alerts.json", "utf8"));

        const { alert_id } = req.params;
        for(const [key, value] of Object.entries(alerts)) {
            if(alert_id == key) {
                return res.status(200).json({
                    status: "success",
                    info: "Alert fetched successfully",
                    data: {
                        ...value, "alert_id": alert_id
                    }
                });
            }
        }

        res.status(404).json({
            status: "warning",
            info: "No alert with the given alert_id was found",
            data: []
        });
        
    } catch(err) {
        res.status(500).json({
            status: "error",
            info: "An unknown error occured, please try again later"
        });
    }
});

app.listen(5000, () => {
    console.log("Listening on port 5000...");
})