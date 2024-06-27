from flask import Flask, jsonify, request
from flask_cors import CORS
import psutil
import time
from pysnmp.hlapi import *
import socket
import socket
import subprocess

app = Flask(__name__)
CORS(app)

# Simulated database for devices with online status
devices = {}

def get_network_stats(ip_address):
    stats = psutil.net_io_counters()
    host = socket.gethostname()
    # Ping the provided IP address to get latency
    latency = subprocess.check_output(f"ping -n 1 {ip_address} | findstr Average", shell=True)
    latency = latency.decode('utf-8').strip().split('=')[-1].split('ms')[0]
    return {
        'bytes_sent': stats.bytes_sent,
        'bytes_recv': stats.bytes_recv,
        'packets_sent': stats.packets_sent,
        'packets_recv': stats.packets_recv,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'host': host,
        'latency': latency
    }

# Route to fetch network stats
@app.route('/stats', methods=['GET'])
def stats():
    return jsonify(get_network_stats("localhost"))

from pythonping import ping

def is_device_online(ip_address):
    try:
        response = ping(ip_address, count=1, timeout=2)
        return True if response.success() else False
    except Exception:
        return False

# Route to fetch device info
@app.route('/device-info', methods=['POST'])
def device_info():
    data = request.get_json()
    ip_address = data.get('ip_address')
    return jsonify(get_device_info(ip_address))

# Route to add a new device
@app.route('/add-device', methods=['POST'])
def add_device():
    data = request.get_json()
    ip_address = data.get('ip_address')

    if ip_address in devices:
        return jsonify({'message': 'Device already exists'}), 400

    # Check if the device is online
    if is_device_online(ip_address):
        # Get the network stats of the device
        network_stats = get_network_stats(ip_address)
        latency = network_stats['latency']

        # Add the device to the database with the initial online status and latency
        devices[ip_address] = {
            'ip_address': ip_address,
            'added_on': time.strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'online',
            'latency': latency
        }
        return jsonify({'message': 'Device added successfully'})
    else:
        return jsonify({'message': 'Device is not reachable or does not respond'}), 400
# Route to remove a device
@app.route('/remove-device', methods=['POST'])
def remove_device():
    data = request.get_json()
    ip_address = data.get('ip_address')

    if ip_address not in devices:
        return jsonify({'message': 'Device does not exist'}), 400

    # Simulate removing device from database
    del devices[ip_address]

    return jsonify({'message': 'Device removed successfully'})

@app.route('/devices', methods=['GET'])
def devices_list():
    updated_devices = []
    for ip_address, device_info in devices.items():
        if is_device_online(ip_address):
            device_info['status'] = 'online'
            network_stats = get_network_stats(ip_address)
            latency = network_stats['latency']
            device_info['latency'] = latency
        else:
            device_info['status'] = 'offline'
            device_info['latency'] = None


        updated_devices.append(device_info)
    return jsonify(updated_devices)

if __name__ == "__main__":
    app.run(port=5001)
