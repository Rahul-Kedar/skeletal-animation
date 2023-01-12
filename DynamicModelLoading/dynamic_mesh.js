var MAX_BONE_INFLUENCE = 4;

function Vertex() 
{
    // position
    this.Position = [0.0, 0.0, 0.0];
    // normal
    this.Normal = [0.0, 0.0, 0.0];
    // texCoords
    this.TexCoords = [0.0, 0.0];
    //bone indexes which will influence this vertex
    this.m_BoneIDs = [-1, -1, -1, -1];
    //weights from each bone
    this.m_Weights = [0.0, 0.0, 0.0, 0.0];
};

class DynamicMesh {
    
    // mesh Data
    m_vertices;
    m_indices;
    m_VAO;
    // render data 
    m_VBO;
    m_EBO;

    m_material;
    m_texture;

    // constructor
    constructor(vertices, indices, material)
    {
        this.m_vertices = new ArrayBuffer(vertices.length * 16 * 4);
        const dv = new DataView(this.m_vertices);
        
        this.m_indices = new Uint32Array(indices);

        vertices.forEach((vertex, i) => {
            dv.setFloat32((16 * 4 * i) + 0, vertex.Position[0], true);
            dv.setFloat32((16 * 4 * i) + 4, vertex.Position[1], true);
            dv.setFloat32((16 * 4 * i) + 8, vertex.Position[2], true);
            dv.setFloat32((16 * 4 * i) + 12, vertex.Normal[0], true);
            dv.setFloat32((16 * 4 * i) + 16, vertex.Normal[1], true);
            dv.setFloat32((16 * 4 * i) + 20, vertex.Normal[2], true);
            dv.setFloat32((16 * 4 * i) + 24, vertex.TexCoords[0], true);
            dv.setFloat32((16 * 4 * i) + 28, vertex.TexCoords[1], true);
            dv.setInt32((16 * 4 * i) + 32, vertex.m_BoneIDs[0], true);
            dv.setInt32((16 * 4 * i) + 36, vertex.m_BoneIDs[1], true);
            dv.setInt32((16 * 4 * i) + 40, vertex.m_BoneIDs[2], true);
            dv.setInt32((16 * 4 * i) + 44, vertex.m_BoneIDs[3], true);
            dv.setFloat32((16 * 4 * i) + 48, vertex.m_Weights[0], true);
            dv.setFloat32((16 * 4 * i) + 52, vertex.m_Weights[1], true);
            dv.setFloat32((16 * 4 * i) + 56, vertex.m_Weights[2], true);
            dv.setFloat32((16 * 4 * i) + 60, vertex.m_Weights[3], true);
        });
        
        this.m_VAO = 0; 
        this.m_VBO = 0;
        this.m_EBO = 0;

        // now that we have all the required data, set the vertex buffers and its attribute pointers.
        this.setupMesh();

        this.m_material = new Material(material);
        this.m_texture = new Texture("Resources/tex/" + this.m_material.m_tex_file);
    }

    // render the mesh
    Draw()
    {
        // draw mesh
        gl.bindVertexArray(this.m_VAO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_EBO);
        gl.bindTexture(gl.TEXTURE_2D, this.m_texture.m_textureId);
        gl.drawElements(gl.TRIANGLES, this.m_indices.length, gl.UNSIGNED_INT, null);
        gl.bindVertexArray(null);
    }

    // initializes all the buffer objects/arrays
    setupMesh()
    {
        // create buffers/arrays
        this.m_VAO = gl.createVertexArray();
        this.m_VBO = gl.createBuffer();
        this.m_EBO = gl.createBuffer();

        gl.bindVertexArray(this.m_VAO);
        // load data into vertex buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_VBO);
        // A great thing about structs is that their memory layout is sequential for all its items.
        // The effect is that we can simply pass a pointer to the struct and it translates perfectly to a glm::vec3/2 array which
        // again translates to 3/2 floats which translates to a byte array.
        gl.bufferData(gl.ARRAY_BUFFER, this.m_vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.m_indices, gl.STATIC_DRAW);

        // set the vertex attribute pointers
        // vertex Positions
        gl.vertexAttribPointer(WebGLMacros.AMC_ATRRIBUTE_POSITION, 3, gl.FLOAT, false, 16 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(WebGLMacros.AMC_ATRRIBUTE_POSITION);
        // vertex normals
        gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_NORMAL, 3, gl.FLOAT, false, 16 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_NORMAL);
        // vertex texture coords
        gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXCORD, 2, gl.FLOAT, false, 16 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXCORD);
        // ids
        gl.vertexAttribIPointer(WebGLMacros.AMC_ATTRIBUTE_BONEID, 4, gl.INT, 16 * Int32Array.BYTES_PER_ELEMENT, 8 * Int32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_BONEID);
        // weights
        gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_WEIGHTS, 4, gl.FLOAT, false, 16 * Float32Array.BYTES_PER_ELEMENT, 12 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_WEIGHTS); 
        gl.bindVertexArray(null);
    }

    uninitialize()
    {
        this.m_texture.uninitialize();
        gl.deleteVertexArray(this.m_VAO);
    }
}