local shaderName = "sketch"
local isShaderSupported = false

function onCreatePost()
    if shadersSupported then
        isShaderSupported = true
        initLuaShader(shaderName)
        
        runHaxeCode([[
            var shader = game.createRuntimeShader(']] .. shaderName .. [[');
            game.camGame.setFilters([new openfl.filters.ShaderFilter(shader)]);
            
            shader.setFloatArray('iResolution', [1280.0, 720.0, 0.0]);
            shader.setFloat('iTime', 0.0);
        ]])
    end
end

function onUpdate(elapsed)
    if isShaderSupported then
        local shaderTime = getPropertyFromClass('backend.Conductor', 'songPosition') / 1000
        
        runHaxeCode([[
            var filter = game.camGame.getFilters()[0];
            if (filter != null && filter.shader != null) {
                filter.shader.setFloat('iTime', ]] .. shaderTime .. [[);
            }
        ]])
    end
end
