import { networkInterfaces } from 'os';

export default function getLocalIP() {
	const nets = networkInterfaces();

	const ip = Object.values(nets)
		.flat() // Flatten the array of network interfaces
		.find((net) => net?.family === 'IPv4' && !net.internal)?.address;

	if (!ip) {
		throw new Error('Unable to determine local IP');
	}

	return ip;
}
