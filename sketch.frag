#pragma header

uniform float iTime;
uniform vec3 iResolution;

// Toggles (Comment out with // to turn off)
//#define distort_all
#define invert_color

float rand(float x)
{
    return fract(sin(x) * 43758.5453);
}

float triangle(float x)
{
    return abs(1.0 - mod(abs(x), 2.0)) * 2.0 - 1.0;
}

void main()
{
    // Steps time down to 16 FPS to create a choppy hand-drawn look
    float time = floor(iTime * 16.0) / 16.0;
    
    vec2 uv = openfl_TextureCoordv;
    vec2 fragCoord = uv * iResolution.xy;
    
    // Distort pixel coordinates to simulate shaky paper outlines
    vec2 p = uv;    
    p += vec2(triangle(p.y * rand(time) * 4.0) * rand(time * 1.9) * 0.015,
              triangle(p.x * rand(time * 3.4) * 4.0) * rand(time * 2.1) * 0.015);
    p += vec2(rand(p.x * 3.1 + p.y * 8.7) * 0.01,
              rand(p.x * 1.1 + p.y * 6.7) * 0.01);
            
    // Base color sampling
    vec4 baseColor;
    #ifdef distort_all
    vec2 blurredUV = vec2(p.x + 0.003, p.y + 0.003);
    baseColor = vec4(flixel_texture2D(bitmap, blurredUV).rgb, 1.0);
    #else
    baseColor = vec4(flixel_texture2D(bitmap, uv).rgb, 1.0);
    #endif
    
    // Edge detection math comparing static coordinates vs shaky ones
    vec4 edges = 1.0 - (baseColor / vec4(flixel_texture2D(bitmap, p).rgb, 1.0));
    
    // Color assignment logic based on defined layout style
    vec4 finalColor;
    #ifdef invert_color
    baseColor.rgb = vec3(baseColor.r);    
    finalColor = baseColor / vec4(length(edges));
    #else
    finalColor = vec4(vec3(length(edges)), 1.0);
    #endif

    // Preserve the original engine asset alpha maps so UI/Characters don't get boxed
    vec4 actualTex = flixel_texture2D(bitmap, uv);
    gl_FragColor = vec4(finalColor.rgb, actualTex.a);
}
