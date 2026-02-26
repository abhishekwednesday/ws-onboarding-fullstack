import type { StorybookConfig } from "@storybook/nextjs"
import webpack from "webpack"
import path from "node:path"

const ENV_MOCK = path.resolve(__dirname, "mocks/env.ts")

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.mdx",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../features/**/*.stories.mdx",
    "../features/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: false,
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    config.resolve ??= {}
    config.resolve.alias = {
      "@/env.mjs": ENV_MOCK,
      "@/env": ENV_MOCK,
      ...config.resolve.alias,
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      dns: false,
      fs: false,
      child_process: false,
      pg: false,
      "pg-native": false,
    }

    config.plugins ??= []
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/[\\/]env\.mjs$/, ENV_MOCK))

    return config
  },
}
export default config
