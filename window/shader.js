// Vertex Shader
const vertexShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

// Fragment Shader
const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D tex0;

// Paramètres ajustables
const float scanLineCount = 100.0;
const float noiseAmount = 0.05;
const float colorShiftAmount = 0.003;
const float vignetteStrength = 0.8;

// Fonction pour générer du bruit pseudo-aléatoire
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y; // Flip l'axe Y pour P5.js
    
    // Effet de décalage des couleurs (color shifting)
    vec2 rOffset = vec2(colorShiftAmount * sin(u_time), 0.0);
    vec2 gOffset = vec2(0.0, 0.0);
    vec2 bOffset = vec2(-colorShiftAmount * sin(u_time), 0.0);
    
    float r = texture2D(tex0, uv + rOffset).r;
    float g = texture2D(tex0, uv + gOffset).g;
    float b = texture2D(tex0, uv + bOffset).b;
    
    // Scanlines
    float scanLine = sin(uv.y * scanLineCount + u_time * 5.0) * 0.1 + 0.9;
    
    // Bruit dynamique
    float noise = random(uv + u_time) * noiseAmount;
    
    // Vignette
    vec2 center = vec2(0.5, 0.5);
    float dist = length(uv - center);
    float vignette = 1.0 - dist * vignetteStrength;
    
    // Assemblage final
    vec3 color = vec3(r, g, b);
    color *= scanLine;
    color += noise;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}
`;