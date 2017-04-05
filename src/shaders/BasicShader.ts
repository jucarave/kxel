import ShaderStructure from './ShaderStructure';

let BasicShader: ShaderStructure = {
    vertexShader: `
        precision mediump float;

        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uProjection;
        uniform mat4 uPosition;
        uniform float uZoom;

        varying vec2 vTexCoord;

        void main(void) {
            gl_Position = uProjection * uPosition * vec4(aVertexPosition * uZoom, 0.0, 1.0);

            vTexCoord = aTextureCoord;
        }
    `,

    fragmentShader: `
        precision mediump float;

        uniform sampler2D uTexture;
        uniform vec2 uUV;

        varying vec2 vTexCoord;

        void main(void) {
            vec2 coord = vTexCoord;
            coord.x /= uUV.x;
            coord.y /= uUV.y;

            gl_FragColor = texture2D(uTexture, coord);
        }
    `
};

export default BasicShader;