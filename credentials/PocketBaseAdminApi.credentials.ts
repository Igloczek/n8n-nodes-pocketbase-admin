import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PocketBaseAdminApi implements ICredentialType {
	name = 'pocketBaseAdminApi';
	displayName = 'PocketBase Admin API';
	documentationUrl = 'https://pocketbase.io/docs/authentication/';
	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			description: 'The URL of the PocketBase instance',
			name: 'url',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Email',
			description: 'The email address of the PocketBase admin (superuser)',
			name: 'email',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			description: 'The password of the PocketBase admin (superuser)',
			name: 'password',
			type: 'string',
			default: '',
			required: true,
			typeOptions: {
				password: true,
			},
		},
	];
}
