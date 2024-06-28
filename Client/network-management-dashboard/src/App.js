import React, {useEffect, useState} from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './App.css';
import Snackbar from './Snackbar';

const GET_NETWORK_STATS = gql`
  query GetNetworkStats {
    getNetworkStats {
      bytes_sent
      bytes_recv
      packets_sent
      packets_recv
      timestamp
      host
      latency
    }
  }
`;

const GET_DEVICES = gql`
  query GetDevices {
    getDevices {
      ip_address
      added_on
      status
      latency
    }
  }
`;

const ADD_DEVICE = gql`
  mutation AddDevice($ip_address: String!) {
    addDevice(ip_address: $ip_address)
  }
`;

const REMOVE_DEVICE = gql`
  mutation RemoveDevice($ip_address: String!) {
    removeDevice(ip_address: $ip_address)
  }
`;

const NetworkStats = () => {
    const { loading, error, data, refetch } = useQuery(GET_NETWORK_STATS);

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 2000);
        return () => clearInterval(interval);
    }, [refetch]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    return (
        <div className="network-stats">
            <h2>Network Stats</h2>
            <p>Bytes Sent: {data.getNetworkStats.bytes_sent}</p>
            <p>Bytes Received: {data.getNetworkStats.bytes_recv}</p>
            <p>Packets Sent: {data.getNetworkStats.packets_sent}</p>
            <p>Packets Received: {data.getNetworkStats.packets_recv}</p>
            <p>Timestamp: {data.getNetworkStats.timestamp}</p>
            <p>Host: {data.getNetworkStats.host}</p>
            <p>Latency: {data.getNetworkStats.latency}</p>
        </div>
    );
};

const Devices = ({ showSnackbar }) => {
    const { loading, error, data, refetch } = useQuery(GET_DEVICES);
    const [addDevice] = useMutation(ADD_DEVICE, {
        refetchQueries: [{ query: GET_DEVICES }],
        onCompleted: () => showSnackbar('Device added successfully', 'success'),
        onError: () => showSnackbar('Failed to add device', 'error')
    });
    const [removeDevice] = useMutation(REMOVE_DEVICE, {
        refetchQueries: [{ query: GET_DEVICES }],
        onCompleted: () => showSnackbar('Device removed successfully', 'success'),
        onError: () => showSnackbar('Failed to remove device', 'error')
    });

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 2000);
        return () => clearInterval(interval);
    }, [refetch]);

    const [newIpAddress, setNewIpAddress] = useState('');

    const handleAddDevice = () => {
        if (newIpAddress.trim() !== '') {
            addDevice({ variables: { ip_address: newIpAddress } });
            setNewIpAddress('');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="devices">
            <h2>Devices</h2>
            <ul className="device-list">
                {data.getDevices.map((device) => (
                    <li key={device.ip_address}>
                        <span>{device.ip_address} - {device.status} - {device.latency}</span>
                        <button
                            className="remove-button"
                            onClick={() => removeDevice({ variables: { ip_address: device.ip_address } })}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
            <div className="add-device">
                <input
                    type="text"
                    placeholder="Enter IP address"
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                />
                <button onClick={handleAddDevice}>Add Device</button>
            </div>
        </div>
    );
};

const App = () => {
    const [snackbar, setSnackbar] = useState({ message: '', type: '', visible: false });

    const showSnackbar = (message, type) => {
        setSnackbar({ message, type, visible: true });
        setTimeout(() => {
            setSnackbar({ ...snackbar, visible: false });
        }, 3000);
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, visible: false });
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Network Management Dashboard</h1>
            </div>
            <NetworkStats />
            <Devices showSnackbar={showSnackbar} />
            {snackbar.visible && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={closeSnackbar}
                />
            )}
        </div>
    );
};

export default App;
