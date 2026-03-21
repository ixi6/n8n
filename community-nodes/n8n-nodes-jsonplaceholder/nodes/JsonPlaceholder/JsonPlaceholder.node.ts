import type { IncomingMessage } from 'http';
import https from 'https';
import _ from 'lodash';
import type {
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IExecuteFunctions,
} from 'n8n-workflow';

function httpGet(url: string): Promise<unknown> {
	return new Promise((resolve, reject) => {
		https
			.get(url, (res: IncomingMessage) => {
				let body = '';
				res.on('data', (chunk: string) => { body += chunk; });
				res.on('end', () => {
					try { resolve(JSON.parse(body)); }
					catch { resolve(body); }
				});
			})
			.on('error', reject);
	});
}

/**
 * Community node that fetches data from JSONPlaceholder.
 *
 * Demonstrates sandboxed execution with a real 3rd-party npm dependency:
 * - `thirdPartyDeps: true` triggers the sandbox
 * - `permissions.network` restricts which hosts the sandbox can reach
 * - lodash is used for data transformation inside the V8 isolate
 * - HTTP is done via Node.js built-in `https` module
 */
export class JsonPlaceholder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JSONPlaceholder',
		name: 'jsonPlaceholder',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}}',
		description: 'Fetch data from the JSONPlaceholder test API',
		defaults: { name: 'JSONPlaceholder' },
		inputs: ['main'] as INodeTypeDescription['inputs'],
		outputs: ['main'] as INodeTypeDescription['outputs'],

		thirdPartyDeps: true,

		permissions: {
			network: { allowedHosts: ['jsonplaceholder.typicode.com'] },
		},

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Post', value: 'posts' },
					{ name: 'Comment', value: 'comments' },
					{ name: 'User', value: 'users' },
					{ name: 'Todo', value: 'todos' },
					{ name: 'Album', value: 'albums' },
					{ name: 'Photo', value: 'photos' },
				],
				default: 'posts',
				description: 'The JSONPlaceholder resource to fetch',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get', value: 'get', description: 'Get a single resource by ID' },
					{ name: 'List', value: 'list', description: 'List all resources' },
				],
				default: 'get',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'number',
				default: 1,
				description: 'The ID of the resource to fetch',
				displayOptions: {
					show: { operation: ['get'] },
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 10,
				description: 'Max number of results to return',
				typeOptions: { minValue: 1, maxValue: 100 },
				displayOptions: {
					show: { operation: ['list'] },
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let url = `https://jsonplaceholder.typicode.com/${resource}`;

			if (operation === 'get') {
				const id = this.getNodeParameter('id', i) as number;
				url += `/${id}`;
				const data = await httpGet(url) as Record<string, unknown>;
				returnData.push({ json: _.pick(data, ['id', 'title', 'body', 'userId']) as INodeExecutionData['json'] });
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				url += `?_limit=${limit}`;
				const data = await httpGet(url);
				const results = Array.isArray(data) ? data.slice(0, limit) : [data];
				const sorted = _.sortBy(results, ['id']);
				for (const item of sorted) {
					returnData.push({ json: _.pick(item, ['id', 'title', 'body', 'userId']) as INodeExecutionData['json'] });
				}
			}
		}

		return [returnData];
	}
}
