class Texture {

	//texture id
	m_textureId;

	constructor(textureFilePath) {
        this.textureFilePath = textureFilePath;

		var textureHandler;
        var anisotropyExtension = gl.getExtension("EXT_texture_filter_anisotropic");
        const ext = gl.getExtension("EXT_color_buffer_float");
        gl.getExtension('OES_texture_float');   
        if (!ext) {
            alert("need EXT_color_buffer_float");
            return;
        }

        textureHandler = gl.createTexture();
        textureHandler.image = new Image();
        textureHandler.image.src = textureFilePath;
        textureHandler.image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, textureHandler);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            if (anisotropyExtension != null) {
            // turn on anisotropic filtering only if it is available.
            var max = gl.getParameter(anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            gl.texParameteri(gl.TEXTURE_2D, 
            anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT, max);
            }
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, gl.RGBA, gl.FLOAT, textureHandler.image);
          //  gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB,gl.RGBA, gl.UNSIGNED_BYTE, textureHandler.image); 
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);

        };

        this.m_textureId = textureHandler;
	}

    uninitialize(){
        gl.deleteTexture(m_textureId);
    }
}