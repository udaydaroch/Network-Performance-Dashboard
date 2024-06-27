const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const cors = require('cors');

const schema = buildSchema(`
    type NetworkStats {
        bytes_sent: Float
        bytes_recv: Float
        packets_sent: Float
        packets_recv: Float
        timestamp: String
        host: String
        latency: String
        
    }

    type DeviceInfo {
        sysDescr: String
        error: String
    }

    type Device {
        ip_address: String
        added_on: String
        status: String
        latency: String
    }

    type Query {
        getNetworkStats: NetworkStats
        getDeviceInfo(ip_address: String!): DeviceInfo
        getDevices: [Device]  # Define the getDevices query
    }

    type Mutation {
        addDevice(ip_address: String!): String
        removeDevice(ip_address: String!): String
    }
`);

const root = {
    getNetworkStats: async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5001/stats');
            return {
                ...response.data,
                host: response.data.host,
                latency: response.data.latency
            };
        } catch (error) {
            console.error('Error fetching network stats:', error.message);
            throw new Error('Unable to fetch network stats');
        }
    },
    getDeviceInfo: async ({ ip_address }) => {
        try {
            const response = await axios.post('http://127.0.0.1:5001/device-info', { ip_address });
            return response.data;
        } catch (error) {
            console.error('Error fetching device info:', error.message);
            throw new Error('Unable to fetch device info');
        }
    },
        getDevices: async () => {
            try {
                const response = await axios.get('http://localhost:5001/devices');
                return response.data;
            } catch (error) {
                console.error('Error fetching devices:', error.message);
                throw new Error('Unable to fetch devices');
            }
        },
    addDevice: async ({ ip_address }) => {
        try {
            const response = await axios.post('http://127.0.0.1:5001/add-device', { ip_address });
            return response.data.message;
        } catch (error) {
            console.error('Error adding device:', error.message);
            throw new Error('Unable to add device');
        }
    },
    removeDevice: async ({ ip_address }) => {
        try {
            const response = await axios.post('http://127.0.0.1:5001/remove-device', { ip_address });
            return response.data.message;
        } catch (error) {
            console.error('Error removing device:', error.message);
            throw new Error('Unable to remove device');
        }
    }
};

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    optionsSuccessStatus: 200 // Some legacy browsers (IE11) choke on 204
};

app.use(cors(corsOptions));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
});
