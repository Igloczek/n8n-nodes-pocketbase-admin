const PocketBaseSDK = require('pocketbase/cjs');

import { NodeOperationError } from 'n8n-workflow';

import type { IDataObject, IExecuteFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import type PocketBaseClient from 'pocketbase';
import type { RecordListOptions } from 'pocketbase';

interface Credentials {
	url: string;
	email: string;
	password: string;
}

export class PocketBaseAdmin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PocketBase Admin',
		name: 'pocketBaseAdmin',
		icon: 'file:pocketbase.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["action"] + " " + $parameter["collection"]}}',
		description: 'Consume PocketBase API',
		defaults: {
			name: 'PocketBase',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'pocketBaseAdminApi',
				required: true,
			},
		],

		properties: [
			{
				displayName: 'Collection',
				name: 'collection',
				type: 'string',
				default: '',
				required: true,
				description: "ID or name of the records' collection",
			},
			{
				displayName: 'Actions',
				name: 'action',
				type: 'options',
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a new record',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Deletes a single record by its ID',
					},
					{
						name: 'Get First List Item',
						value: 'getFirstListItem',
						action: 'Returns the first record that matches the specified filter',
					},
					{
						name: 'Get Full List',
						value: 'getFullList',
						action: 'Returns full list of records matching the specified filter',
					},
					{
						name: 'Get List',
						value: 'getList',
						action: 'Returns a paginated records list matching the specified filter',
					},
					{
						name: 'Get One',
						value: 'getOne',
						action: 'Returns a single record by its ID',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update an existing record by its ID',
					},
				],
				default: 'create',
				required: true,
				noDataExpression: true,
			},
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						action: ['getOne', 'update', 'delete'],
					},
				},
			},
			{
				displayName: 'Pagination',
				name: 'pagination',
				type: 'collection',
				default: {},
				displayOptions: {
					show: {
						action: ['getList'],
					},
				},
				options: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 1,
					},
					{
						displayName: 'Elements Per Page',
						name: 'elementsPerPage',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 30,
					},
					{
						displayName: 'Skip Total',
						name: 'skipTotal',
						type: 'boolean',
						default: false,
					},
				],
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'collection',
				default: {},
				displayOptions: {
					show: {
						action: ['getList', 'getFirstListItem', 'getFullList'],
					},
				},
				options: [
					{
						displayName: 'Sort',
						name: 'sort',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Filter',
						name: 'filter',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Expand',
						name: 'expand',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Fields',
						name: 'fields',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Body Parameters',
				name: 'bodyParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						action: ['create', 'update'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description:
									'ID of the field to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the field to set',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];
		const auth = (await this.getCredentials('pocketBaseAdminApi', 0)) as unknown as Credentials;
		const action = this.getNodeParameter('action', 0) as string;

		const pb = new PocketBaseSDK(auth.url);
		await pb.collection('_superusers').authWithPassword(auth.email, auth.password);
		if (!pb.authStore.isValid) {
			throw new NodeOperationError(this.getNode(), `Authentication failed!`);
		}
		const collection = this.getNodeParameter('collection', 0) as string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				let elementData;
				switch (action) {
					case 'getList':
						elementData = await handleGetList(pb, this, collection, itemIndex);
						returnData.push(elementData);
						break;

					case 'getOne':
						elementData = await handleGetOne(pb, this, collection, itemIndex);
						returnData.push(elementData);
						break;

					case 'getFullList':
						elementData = await handleGetFullList(pb, this, collection, itemIndex);
						returnData.push(elementData);
						break;

					case 'getFirstListItem':
						elementData = await handleGetFirstListItem(pb, this, collection, itemIndex);
						returnData.push(elementData);
						break;

					case 'update':
						elementData = await handleUpdate(pb, this, collection, itemIndex);
						returnData.push(elementData);
						break;

					case 'create':
						elementData = await handleCreate(pb, this, collection, itemIndex);
						returnData.push(elementData);
						break;

					case 'delete':
						elementData = await handleDelete(pb, this, collection, itemIndex);
						returnData.push(elementData);
						break;
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const inputData = this.getInputData(itemIndex);
					if (inputData && inputData.length > 0) {
						items.push({ json: inputData[0].json, error, pairedItem: itemIndex });
					} else {
						items.push({ json: {}, error, pairedItem: itemIndex });
					}
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Something went wrong:<br>${JSON.stringify(error.response)}`,
						{ itemIndex },
					);
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}

async function handleGetOne(
	pb: PocketBaseClient,
	context: IExecuteFunctions,
	collection: string,
	itemIndex: number,
) {
	const recordId = context.getNodeParameter('recordId', itemIndex) as string;
	const record = await pb.collection(collection).getOne(recordId);

	return record as IDataObject;
}

async function handleGetList(
	pb: PocketBaseClient,
	context: IExecuteFunctions,
	collection: string,
	itemIndex: number,
) {
	const { page, elementsPerPage, skipTotal } = context.getNodeParameter(
		'pagination',
		itemIndex,
	) as RecordListOptions;

	const parameters = context.getNodeParameter('parameters', itemIndex) as RecordListOptions;

	if (skipTotal) {
		parameters.skipTotal = skipTotal;
	}

	const records = await pb.collection(collection).getList(page, elementsPerPage, parameters);

	return {
		...records,
	} as IDataObject;
}

async function handleGetFullList(
	pb: PocketBaseClient,
	context: IExecuteFunctions,
	collection: string,
	itemIndex: number,
) {
	const parameters = context.getNodeParameter('parameters', itemIndex) as RecordListOptions;

	const records = await pb.collection(collection).getFullList(parameters);

	return {
		...records,
	} as IDataObject;
}

async function handleGetFirstListItem(
	pb: PocketBaseClient,
	context: IExecuteFunctions,
	collection: string,
	itemIndex: number,
) {
	const { filter, ...parameters } = context.getNodeParameter(
		'parameters',
		itemIndex,
	) as RecordListOptions;

	const records = await pb.collection(collection).getFirstListItem(filter || '', parameters);

	return {
		...records,
	} as IDataObject;
}

async function handleUpdate(
	pb: PocketBaseClient,
	context: IExecuteFunctions,
	collection: string,
	itemIndex: number,
) {
	const recordId = context.getNodeParameter('recordId', itemIndex) as string;
	const data = context.getNodeParameter('bodyParameters.parameters', itemIndex) as BodyParameter[];
	const record = await pb.collection(collection).update(recordId, prepareRequestBody(data));

	return record as IDataObject;
}

async function handleCreate(
	pb: PocketBaseClient,
	context: IExecuteFunctions,
	collection: string,
	itemIndex: number,
) {
	const data = context.getNodeParameter('bodyParameters.parameters', itemIndex) as BodyParameter[];
	const record = await pb.collection(collection).create(prepareRequestBody(data));

	return record as IDataObject;
}

async function handleDelete(
	pb: PocketBaseClient,
	context: IExecuteFunctions,
	collection: string,
	itemIndex: number,
) {
	const recordId = context.getNodeParameter('recordId', itemIndex) as string;
	const success = await pb.collection(collection).delete(recordId);

	return { success } as IDataObject;
}

type BodyParameter = { name: string; value: string };
const prepareRequestBody = (parameters: BodyParameter[]) => {
	return parameters.reduce((acc, entry) => {
		acc[entry.name] = entry.value;
		return acc;
	}, {} as IDataObject);
};
