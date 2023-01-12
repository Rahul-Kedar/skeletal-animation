class Shader
{
    m_shaderProgramObject;

    constructor(vertexShader, fragmentShader)
    {        
        // Vertex shader
        let vertexShaderSourcecode = readFile(vertexShader);
        let vertexShaderObject = this.compileShader(vertexShaderSourcecode, gl.VERTEX_SHADER);

        // Fragment Shader
        let fragmentShaderSourceCode = readFile(fragmentShader);
        let fragmentShaderObject = this.compileShader(fragmentShaderSourceCode, gl.FRAGMENT_SHADER);

        // Shader Program
        this.m_shaderProgramObject = gl.createProgram();
        gl.attachShader(this.m_shaderProgramObject, vertexShaderObject);
        gl.attachShader(this.m_shaderProgramObject, fragmentShaderObject);

		gl.bindAttribLocation(this.m_shaderProgramObject, WebGLMacros.AMC_ATRRIBUTE_POSITION, "vPosition");
		gl.bindAttribLocation(this.m_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_TEXCORD, "vTexCord");
		gl.bindAttribLocation(this.m_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_NORMAL, "vNormal");
		gl.bindAttribLocation(this.m_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_COLOR, "vColor");
		gl.bindAttribLocation(this.m_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_BONEID, "vBoneIds");
		gl.bindAttribLocation(this.m_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_WEIGHTS, "vWeights");

        gl.linkProgram(this.m_shaderProgramObject);
        if(gl.getProgramParameter(this.m_shaderProgramObject, gl.LINK_STATUS) == false)
        {
            var error = gl.getProgramInfoLog(this.m_shaderProgramObject);
            if(error.length > 0)
            {
                alert(error);
                uninitialize();
            }
        }
    }

    compileShader(shaderCode, type)
    {
        let shaderObject = gl.createShader(type);
        gl.shaderSource(shaderObject, shaderCode);
        gl.compileShader(shaderObject);

        if(gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS) == false)
        {
            var error = gl.getShaderInfoLog(shaderObject);
            if(error.length > 0)
            {
                let msg = (type === gl.VERTEX_SHADER ? "Vertex Shader Error : " : "Fragment Shader Error : ");
                alert(msg + error);
                uninitialize();
            }
        }

        return shaderObject;
    }

    uninitialize()
    {        
        if(this.m_shaderProgramObject)
        {
            gl.useProgram(this.m_shaderProgramObject);

            var shaderObjects = gl.getAttachedShaders(this.m_shaderProgramObject);

            for(let i = 0; i < shaderObjects.length; i++)
            {
                gl.detachShader(this.m_shaderProgramObject, shaderObjects[i]);
                gl.deleteShader(shaderObjects[i]);
                shaderObjects[i] = 0;
            }

            gl.useProgram(null);
            gl.deleteProgram(this.m_shaderProgramObject);
            this.m_shaderProgramObject = null;
        }
    }
}