// serial-stdio.mts
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { ListResourceTemplatesRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import debug from "debug"
import { createUSBBus, createNodeUSBOptions, CONNECTION_STATE } from "jacdac-ts"
import { WebUSB } from "usb";

const dbgmcp = debug("mcp")
const dbgjd = debug("jacdac")

const options = createNodeUSBOptions(WebUSB)
const bus = createUSBBus(options);

interface McpToolDefinition {
    name: string
    description: string
    inputSchema: {
        type: "object",
        properties: { [index: string]: any; }
        required: string[]
    }
}

dbgmcp("starting")
const server = new Server(
    {
        name: "BBC micro:bit",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {
                listChanged: true,
            },
            tools: {
                listChanged: true,
                list: true,
            },
        },
    }
)
server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
    dbgmcp("List resource templates request")
    return {}
})
server.setRequestHandler(ListToolsRequestSchema, async () => {
    dbgmcp("List tools request")

    return {
    }
})
const transport = new StdioServerTransport()
await server.connect(transport)

// track connection state
bus.on(CONNECTION_STATE, () => {
    dbgjd(`connected: ${bus.connected}`)
})