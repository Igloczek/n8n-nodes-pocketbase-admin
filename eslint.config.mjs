// oxlint can't lint JSON, so ESLint only checks package.json and node codex files,
// mirroring the JSON block of @n8n/node-cli's config.
import tsParser from '@typescript-eslint/parser';
import { n8nCommunityNodesPlugin } from '@n8n/eslint-plugin-community-nodes';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

const communityNodes = n8nCommunityNodesPlugin.configs.recommendedWithoutN8nCloudSupport;

export default [
	{
		files: ['package.json', '**/*.node.json'],
		ignores: ['dist/**'],
		plugins: { ...communityNodes.plugins, 'n8n-nodes-base': n8nNodesBase },
		languageOptions: {
			parser: tsParser,
			parserOptions: { extraFileExtensions: ['.json'] },
		},
		rules: {
			...communityNodes.rules,
			...n8nNodesBase.configs.community.rules,
			// Only required for n8n Cloud / verified nodes, this package depends on the PocketBase SDK
			'@n8n/community-nodes/no-runtime-dependencies': 'off',
		},
	},
];
