# Network Management Dashboard

This application is a Network Management Dashboard that provides real-time statistics about network performance. It allows users to monitor network parameters such as bytes sent/received, packets sent/received, and latency.

## Features

- Real-time network statistics such as packets received and sent by the machine etc.
- Device management: Add and remove devices from the network
- Error handling: Display error messages when network issues occur

## Technologies Used

- Frontend: React.js, Apollo Client, Material-UI
- Backend: Python (Assuming you're using Python for the backend)
- Database: I am currently just storing the information in a dictionary in the python server. 
- API: GraphQL

## How to Run the Application

### Running the Frontend

1. Navigate to the `Client/network-management-dashboard` directory.
2. Install the dependencies by running `npm install`.
3. Start the application by running `npm start`.

### Running the Backend

1. Navigate to the `server` directory.
2. Install the dependencies by running `npm install`.
3. Start the application by running `npm start`.


1. Navigate to the `PythonFolder` directory.
2. Install the dependencies by running
`pip install Flask
pip install flask-cors
pip install psutil
pip install pysnmp`.
3. Start the application by running `python network_stats.py`.

## Future Improvements

1. I will add some ways to detect packet lost information such as notifications on the side of the screen, etc.
2. some ways to detect intrusions as I gain more in-depth knowledge about this topic
   
