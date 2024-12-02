import dgram from 'dgram';
import { LAMPS_PORT, SOCKET_TIMEOUT } from './constants';

export default async function sendMessageToLight(message: string, targetIP: string) {
	const socket = dgram.createSocket('udp4');

	return new Promise((resolve, reject) => {
		socket.on('message', (msg) => {
			try {
				const response = JSON.parse(msg.toString());
				resolve(response);
			} catch (err) {
				console.error('Error parsing response:', err);
				reject(err);
			}
		});

		socket.bind(() => {
			socket.setBroadcast(true);

			socket.send(message, 0, message.length, LAMPS_PORT, targetIP, (err) => {
				if (err) {
					console.error(`Error sending to ${targetIP}:`, err.message);
					reject(err);
				}
			});
		});

		setTimeout(() => {
			socket.close();
			resolve(null);
		}, SOCKET_TIMEOUT);
	});
}
