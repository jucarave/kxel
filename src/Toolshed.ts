import Tool from './tools/Tool';

type AppTools = "zoom" | "hand";

interface ToolMap {
    [index: string] : Tool;
}

class Toolshed {
    private tools: ToolMap;

    constructor() {
        this.tools = {};
    }

    public AddTool(name: AppTools, tool: Tool) {
        this.tools[name] = tool;
    }

    public getTool<T>(name: AppTools): T {
        return <T> (<any> this.tools[name]);
    }
}

export default Toolshed;