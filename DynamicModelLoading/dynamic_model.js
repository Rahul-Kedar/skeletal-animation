class DynamicModel
{
    m_model;
    m_animation;
    m_animator;

    m_shaderobj;
    m_animationShaderObject;
    
    m_deltaTime;
    m_lastFrame;
    m_time;

    constructor(modelPath)
    {
        this.m_deltaTime = 0.0;
        this.m_lastFrame = 0.0;
        this.m_time = 0.0;

        this.m_model = new Model(modelPath);
        this.m_animation = new Animation(modelPath, this.m_model);
        this.m_animator = new Animator(this.m_animation);

        this.m_shaderobj = new Shader("Shaders/dynamic_model.vert", "Shaders/dynamic_model.frag");
    }

    draw(modelMatrix, viewMatrix, projectionMatrix)
    {
        var now = new Date();   
		var currentFrame = now.getTime();
		this.m_deltaTime = currentFrame - this.m_lastFrame;
		this.m_lastFrame = currentFrame; 

        this.m_animator.UpdateAnimation(this.m_deltaTime/1000.0);

        gl.useProgram(this.m_shaderobj.m_shaderProgramObject);

        gl.uniformMatrix4fv(gl.getUniformLocation(this.m_shaderobj.m_shaderProgramObject, "projection"), false, projectionMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.m_shaderobj.m_shaderProgramObject, "view"), false, viewMatrix);
        
		var transforms = this.m_animator.GetFinalBoneMatrices();
		for (let i = 0; i < transforms.length; ++i)
            gl.uniformMatrix4fv(gl.getUniformLocation(this.m_shaderobj.m_shaderProgramObject, "finalBonesMatrices[" + i.toString() + "]"), false, transforms[i]);
                        
        gl.uniformMatrix4fv(gl.getUniformLocation(this.m_shaderobj.m_shaderProgramObject, "model"), false, modelMatrix);
        
        gl.uniform1i(gl.getUniformLocation(this.m_shaderobj.m_shaderProgramObject, "texture_diffuse1"), false, 0);

        this.m_model.Draw(this.m_shaderobj.m_shaderProgramObject);

        gl.useProgram(null);
    }
    
    uninitialize()
    {
        this.m_model.uninitialize();
        this.m_shaderobj.uninitialize();
    }

}
