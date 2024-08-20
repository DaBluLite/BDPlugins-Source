const { defineConfig } = require("bundlebd");

module.exports = defineConfig((plugin, dev) => ({
	input: `${plugin}/src`,
	output: `${plugin}/dist`,
	importAliases: {
		"@common/*": "/common/*",
	},
	bdPath: "/home/dablulite/.config/BetterDiscord",
	moduleComments: false
}));