class Model
{    
	// model data 
	m_meshes;
	m_BoneInfoMap;
	m_BoneCounter;

	// constructor, expects a filepath to a 3D model.
	constructor(path)
	{
        this.m_meshes = [];
        this.m_BoneInfoMap = new Map();
        this.m_BoneCounter = 0;
		this.loadModel(path);
	}

	// draws the model, and thus all its meshes
	Draw()
	{
		for (var i = 0; i < this.m_meshes.length; i++)
            this.m_meshes[i].Draw();
	}

	GetBoneInfoMap() 
    { 
        return this.m_BoneInfoMap; 
    }

	SetBoneInfoMap(boneInfoMap)
	{
		this.m_BoneInfoMap = boneInfoMap;
	}

	GetBoneCount() 
    { 
        return this.m_BoneCounter; 
    }

	SetBoneCount(boneCount)
	{
		this.m_BoneCounter = boneCount;
	}

	// loads a model with supported ASSIMP extensions from file and stores the resulting meshes in the meshes vector.
	loadModel(animationPath)
	{
		var modelFile = readFile(animationPath);
		var Scene = JSON.parse(modelFile);
        
		// process ASSIMP's root node recursively
		this.processNodeJson(Scene);
	}

	processNodeJson(scene)
	{
		var meshArray = scene.meshes;

		for (var i = 0; i < meshArray.length; i++)
		{
			this.m_meshes.push(this.proceessMeshJson(meshArray[i], scene));
		}

	}

	proceessMeshJson(mesh, scene)
	{
		var vertices = [];
		var indices = [];
		var textures = [];

		var verticesArray = mesh.vertices;
		var normalsArray = mesh.normals;
		var texcoordArray = mesh.texturecoords[0];

		for (var i = 0, j = 0; i < verticesArray.length; i+=3, j +=2)
		{
			var vertex = new Vertex();

			vertex.Position = [parseFloat(verticesArray[i]), parseFloat(verticesArray[i + 1]), parseFloat(verticesArray[i + 2])];
			vertex.Normal = [parseFloat(normalsArray[i]), parseFloat(normalsArray[i + 1]), parseFloat(normalsArray[i + 2])];
			vertex.TexCoords = [parseFloat(texcoordArray[j]), parseFloat(texcoordArray[j+1])];

			vertices.push(vertex);
		}


		var facesArray = mesh.faces;

		for (var i = 0; i < facesArray.length; i++)
		{
			var face = facesArray[i];
			for (var j = 0; j < face.length; j++)
				indices.push(parseInt(face[j]));
		}
        
		if('bones' in mesh)
			this.ExtractBoneWeightForVerticesJson(vertices, mesh, scene);

		let material = scene.materials[mesh.materialindex];
		return new DynamicMesh(vertices, indices, material);
	}

	ExtractBoneWeightForVerticesJson(vertices, mesh, scene)
	{
		var boneArray = mesh.bones;

		for (var boneIndex = 0; boneIndex < boneArray.length; ++boneIndex)
		{
			var boneID = -1;
			var boneName = boneArray[boneIndex].name;
			
			if (!this.m_BoneInfoMap.has(boneName))
			{
				var newBoneInfo = new BoneInfo();
				newBoneInfo.id = this.m_BoneCounter;
				
				let offsetmatrix = mat4.create();
				for(let i = 0; i < 16; i++)
					offsetmatrix[i] = parseFloat(boneArray[boneIndex].offsetmatrix[i]);
				
				mat4.transpose(newBoneInfo.offset, offsetmatrix);
				
				this.m_BoneInfoMap.set(boneName, newBoneInfo);
				boneID = this.m_BoneCounter;
				this.m_BoneCounter++;
			}
			else
			{
				boneID = this.m_BoneInfoMap.get(boneName).id;
			}

            if(boneID == -1)
            {
                console.log("ERROR : boneID is -1");
            }
            
			var weightArray = boneArray[boneIndex].weights;

			for (var weightIndex = 0; weightIndex < weightArray.length; ++weightIndex)
			{
				var bone = weightArray[weightIndex];
				
				var vertexId = parseInt(bone[0]);
				var weight = parseFloat(bone[1]);
				this.SetVertexBoneData(vertices[vertexId], boneID, weight);
			}
		}
	}

	SetVertexBoneDataToDefault(vertex)
	{
		for (var i = 0; i < MAX_BONE_INFLUENCE; i++)
		{
			vertex.m_BoneIDs[i] = -1;
			vertex.m_Weights[i] = 0.0;
		}
	}

	SetVertexBoneData(vertex, boneID, weight)
	{
		for (var i = 0; i < MAX_BONE_INFLUENCE; ++i)
		{
			if (vertex.m_BoneIDs[i] < 0)
			{
				vertex.m_Weights[i] = weight;
				vertex.m_BoneIDs[i] = boneID;
				break;
			}
		}
	}

    uninitialize()
    {
		for (var i = 0; i < this.m_meshes.length; i++)
            this.m_meshes[i].uninitialize();
    }
}
