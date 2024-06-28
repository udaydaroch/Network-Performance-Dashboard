import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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
  const { loading, error, data } = useQuery(GET_NETWORK_STATS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
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

const Devices = () => {
  const { loading, error, data } = useQuery(GET_DEVICES);
  const [addDevice] = useMutation(ADD_DEVICE);
  const [removeDevice] = useMutation(REMOVE_DEVICE);

  const handleAddDevice = (ip) => {
    addDevice({ variables: { ip_address: ip } });
  };

  const handleRemoveDevice = (ip) => {
    removeDevice({ variables: { ip_address: ip } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Devices</h2>
      <ul>
        {data.getDevices.map((device) => (
          <li key={device.ip_address}>
            {device.ip_address} - {device.status} - {device.latency}
            <button onClick={() => handleRemoveDevice(device.ip_address)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddDevice('192.168.1.100')}>Add Device</button>
    </div>
  );
};

const App = () => (
  <div>
    <h1>Network Management Dashboard</h1>
    <NetworkStats />
    <Devices />
  </div>
);

export default App;
