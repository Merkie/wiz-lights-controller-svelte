export type Light = {
	ip: string;
	mac: string;
	rssi: number;
	state: boolean;
	sceneId: number;
	r: number;
	g: number;
	b: number;
	c: number;
	w: number;
	dimming: number;
};

export type LightConfig = {
	mac: string;
	homeId: number;
	roomId: number;
	rgn: string;
	moduleName: string;
	fwVersion: string;
	groupId: number;
	ping: number;
	accUdpPropRate: number;
};
