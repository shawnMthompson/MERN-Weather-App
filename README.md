# MERN-Weather-App
This is a full-stack application that provides users with real-time weather information using the MERN (MongoDB, Express.js, React.js, and Node.js) stack.

## Replication Instructions

Follow these steps to replicate this project on your local machine:

1. Clone the repository to your local machine using `git clone <repository-url>`
2. Navigate to the project directory using `cd MERN-Weather-App`
3. Install the necessary dependencies by running `npm install`
4. Create a `.env` file in both the root of the client folder and of the server folder.
5. Open the `.env` file in the client folder and add your OpenWeatherMap API key like this: REACT_APP_WEATHER_API_KEY=<your-api-key>
6. Open the `.env` file in the server folder and add your MongoDB URI like this: MONGODB_URI=<your-mongodb_uri>
7. Change directory `cd` to the client folder: `cd client`
8. Start the application by running `npm start`
9. Direct yourself to localhost:3000 on a JavaScript-enabled browser to view/interact with the application.

* End the application by hitting `ctrl+c` in terminal and entering `Y` when prompted to: Terminate the batch job (Y/N)?

Please note that you need Node.js and npm installed on your machine to run this project.