import Shader from '../engine/Shader';

export interface ShaderStructure {
    vertexShader: string,
    fragmentShader: string
}

export interface ShaderMap {
    [index: string]: Shader
};

let ShaderType = {
    BASIC: "BASIC",
    TRANSPARENT: "TRANSPARENT"
};

export { ShaderType };