import { defineConfig } from 'oxlint';
import { n8nCommunityNodesPlugin } from '@n8n/eslint-plugin-community-nodes';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default defineConfig({
	jsPlugins: ['@n8n/eslint-plugin-community-nodes', 'eslint-plugin-n8n-nodes-base'],
	ignorePatterns: ['dist/**'],
	rules: {
		...n8nCommunityNodesPlugin.configs.recommendedWithoutN8nCloudSupport.rules,
		// Only required for n8n Cloud / verified nodes, this package depends on the PocketBase SDK
		'@n8n/community-nodes/no-runtime-dependencies': 'off',
		'no-console': 'error',
	},
	overrides: [
		{
			files: ['credentials/**/*.ts'],
			rules: {
				...n8nNodesBase.configs.credentials.rules,
				'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
				'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
				'n8n-nodes-base/cred-class-field-type-options-password-missing': 'off',
			},
		},
		{
			files: ['nodes/**/*.ts'],
			rules: {
				...n8nNodesBase.configs.nodes.rules,
				'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
				'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
				'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
				// Superseded by @n8n/community-nodes rules, same as in @n8n/node-cli
				'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
				'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
				'n8n-nodes-base/node-param-type-options-max-value-present': 'off',
			},
		},
	],
});
