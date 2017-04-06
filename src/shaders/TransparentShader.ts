import { ShaderStructure } from './ShaderStructure';

let TransparentShader: ShaderStructure = {
    vertexShader: `
        precision mediump float;

        attribute vec2 aVertexPosition;

        uniform mat4 uProjection;
        uniform mat4 uPosition;
        uniform float uZoom;

        varying vec2 vPosition;

        void main(void) {
            gl_Position = uProjection * uPosition * vec4(aVertexPosition * uZoom, 0.0, 1.0);

            vPosition = aVertexPosition * uZoom;
        }
    `,

    fragmentShader: `
        precision mediump float;

        uniform float uZoom;

        varying vec2 vPosition;

        void main(void) {
            vec2 modCoord = mod(vPosition, vec2(32.0 * uZoom));
            vec4 col = vec4(0.2352, 0.2352, 0.2352, 1.0);

            float midVal = 16.0 * uZoom;

            if ((modCoord.x < midVal && modCoord.y < midVal) || (modCoord.x >= midVal && modCoord.y >= midVal)) {
                col = vec4(0.4784, 0.4784, 0.4784, 1.0);
            }

            gl_FragColor = col;
        }
    `
};

export default TransparentShader;