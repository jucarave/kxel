import Tool from './tools/Tool';

type AppTools = "zoom" | "hand";

interface ToolMap {
    [index: string] : Tool;
}

class Toolshed {
    private toolMap             :       ToolMap;
    public readonly tools       :       Array<Tool>;

    constructor() {
        this.toolMap = {};
        this.tools = [];
    }

    public addTool(name: AppTools, tool: Tool) {
        this.toolMap[name] = tool;
        this.tools.push(tool);
    }

    public getTool<T>(name: AppTools): T {
        return <T> (<any> this.toolMap[name]);
    }
}

export default Toolshed;