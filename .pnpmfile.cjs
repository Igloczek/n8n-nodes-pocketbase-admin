// The project compiles with TypeScript 7, which has no JS compiler API.
// The n8n lint plugins load it through @typescript-eslint, so give those packages TypeScript 6.
function readPackage(pkg) {
	if (pkg.name.startsWith('@typescript-eslint/') && pkg.peerDependencies?.typescript) {
		delete pkg.peerDependencies.typescript;
		pkg.dependencies = { ...pkg.dependencies, typescript: '~6.0.3' };
	}
	return pkg;
}

module.exports = { hooks: { readPackage } };
