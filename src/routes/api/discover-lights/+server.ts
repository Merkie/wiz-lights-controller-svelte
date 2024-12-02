import discoverLights from '$lib/discoverLights';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const lights = await discoverLights();

	// const lightsWithConfig = await Promise.all(
	// 	lights.map(async (light) => {
	// 		const response = (await sendMessageToLight(
	// 			JSON.stringify({ method: 'getSystemConfig', params: {} }),
	// 			light.ip
	// 		)) as { result: LightConfig };

	// 		if (!response.result) return light;

	// 		return { ...light, config: response.result };
	// 	})
	// );

	return json({ lights });
};
