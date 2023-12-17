# EnviewAssignment20JE0586

This project implements a simple RESTful API for managing a library system using Django and PostgreSQL.

Please refer to Documentation.pdf for more details

## Setup Instructions

### Prerequisites

- NodeJS installed

### Installation Steps

1. Clone this repository to your local machine.

   ```bash
   git clone https://github.com/Deepikamudragalla/EnviewAssignment20JE0586
   ```


2. Install dependencies.

   ```powershell
   npm install 
   ```

### Running the Server

1. Start the node server.

   ```bash
   node index.js
   ```

2. The server will start running on `http://localhost:5000` by default.

### API Endpoints (Set Content-Type to `application/json`)

| Endpoint            | HTTP Method | CRUD Method | Result                | Payload(request body)                        |
| ------------------- | ----------- | ----------- | --------------------- | -------------------------------------------- |
| `/event`            | POST        | CREATE      | A driving event created| addEventPayload                                   |
| `/alert/{alert_id}` | GET         | READ        | Read an alert     | No Payload                                |


where addEventPayload is of the format
```javascript
{
    "timestamp": "(ISO Date Format) - The time at which event is added.,required",
    "is_driving_safe": "(boolean) -  If the driving speed is safe or not, required",
    "vehicle_id": "(str) - The id of the vehicle, required",
    "location_type": "(str) - Any value from keys of threshold.json( presently highway, residential, commercial, city_center. More values may be added in the future by adding required key value pair in thresholds.json.) ",
}
```

## Usage

- Use tools like Postman or CURL to make requests to the provided endpoints.
- For example:
  - Add a driving event: `POST http://localhost:5000/event` with a JSON payload.
  - Read an alert: `PUT http://localhost:5000/alert/{alert_id}` with a JSON payload (alert_id is an 
    integer).
