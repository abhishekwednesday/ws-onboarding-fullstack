import type { Meta, StoryObj } from "@storybook/react"
import { CatalogCard } from "./CatalogCard"
import { type CatalogItemType, MOCK_CATALOG_ITEMS } from "../types/catalog-types"

const meta: Meta<typeof CatalogCard> = {
  title: "Features/Catalog/CatalogCard",
  component: CatalogCard,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[300px] p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CatalogCard>

const mockItem = MOCK_CATALOG_ITEMS[0]!

export const Default: Story = {
  args: {
    item: mockItem,
  },
}

export const LongTitle: Story = {
  args: {
    item: {
      ...mockItem,
      title: "Bohemian Rhapsody (Original Soundtrack Remix 2026 Remastered Deluxe Edition)",
    },
  },
}

export const NoArtwork: Story = {
  args: {
    item: {
      ...mockItem,
      artworkUrl: undefined,
    },
  },
}
