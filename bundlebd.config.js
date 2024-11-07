const { defineConfig } = require("bundlebd");

module.exports = defineConfig((plugin, dev) => ({
	input: `${plugin}/src`,
	output: `${plugin}/dist`,
	importAliases: {
		"@common/*": "/common/*",
	},
	moduleComments: false
}));