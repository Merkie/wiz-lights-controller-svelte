import dgram from 'dgram';
import getLocalIP from './getLocalIP';
import { LAMPS_PORT, SOCKET_TIMEOUT } from './constants';
import type { Light } from './types';

export default async function discoverLights(): Promise<Light[]> {
	const localIP = getLocalIP();
	const subnet = localIP.split('.').slice(0, 3).join('.'); // Extract subnet (e.g., "192.168.1")
	const message = JSON.stringify({ method: 'getPilot', params: {} });
	const socket = dgram.createSocket('udp4');
	const lights = new Map();

	return new Promise((resolve, reject) => {
		const sentIPs = new Set();

		// Handle responses
		socket.on('message', (msg, rinfo) => {
			try {
				const response = JSON.parse(msg.toString());
				lights.set(rinfo.address, { ip: rinfo.address, ...(response.result || {}) });
			} catch (err) {
				console.error('Error parsing response:', err);
			}
		});

		socket.bind(() => {
			socket.setBroadcast(true);

			// Send messages to all IPs in the subnet
			for (let i = 1; i <= 255; i++) {
				const targetIP = `${subnet}.${i}`;
				socket.send(message, 0, message.length, LAMPS_PORT, targetIP, (err) => {
					if (err) {
						console.error(`Error sending to ${targetIP}:`, err.message);
					} else {
						sentIPs.add(targetIP);
					}
				});
			}

			// Close the socket after the timeout
			setTimeout(() => {
				socket.close();
				resolve(Array.from(lights.values()));
			}, SOCKET_TIMEOUT);
		});

		// Handle socket errors
		socket.on('error', (err) => {
			console.error('Socket error:', err);
			socket.close();
			reject(err);
		});
	});
}
