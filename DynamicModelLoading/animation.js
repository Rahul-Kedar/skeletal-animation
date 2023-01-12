function AssimpNodeData()
{
	this.transformation = mat4.create();
	this.name = "";
	this.childrenCount = 0;
	this.children = [];
};

class Animation
{   
	m_Duration;
	m_TicksPerSecond;
	m_Bones;
	m_RootNode;
	m_BoneInfoMap;
    
	constructor(animationPath, model)
	{
		this.m_Duration = 0.0;
		this.m_TicksPerSecond = 0;
		this.m_Bones = [];
		this.m_RootNode = new AssimpNodeData();
		this.m_BoneInfoMap = new Map();

		var modelFile = readFile(animationPath);

		var Scene = JSON.parse(modelFile);
        
        if('animations' in Scene)
        {
            console.log("animations is present in Scene");
        }
        else
        {
            alert("animations is not present in Scene");
        }
        
		var animation = Scene.animations[0];
		this.m_Duration = animation.duration;
		this.m_TicksPerSecond = animation.tickspersecond;
        
		var rootnode = Scene.rootnode;

		this.ReadHeirarchyDataJson(this.m_RootNode, rootnode);
		this.ReadMissingBonesJson(animation, model);
	}

	FindBone(name)
	{
        for(var i = 0; i < this.m_Bones.length; i++)
        {
            if(this.m_Bones[i].m_Name == name)
                return this.m_Bones[i];
        }

        return null;
	}


	GetTicksPerSecond() { return this.m_TicksPerSecond; }
	GetDuration() { return this.m_Duration; }
	GetRootNode() { return this.m_RootNode; }
	GetBoneIDMap()
	{
		return this.m_BoneInfoMap;
	}

	ReadHeirarchyDataJson(dest, src)
	{
		dest.name = src.name;
		
		let srcTransformationMat4 = mat4.create();
		for(let i = 0; i < 16; i++)
			srcTransformationMat4[i] = parseFloat(src.transformation[i]);

		mat4.transpose(dest.transformation, srcTransformationMat4);

		dest.childrenCount = 0;

        if('children' in src)
		{
			var childArray = src.children;
			dest.childrenCount = childArray.length;
			for (var i = 0; i < dest.childrenCount; i++)
			{
                var newData = new AssimpNodeData();
				this.ReadHeirarchyDataJson(newData, childArray[i]);
				dest.children.push(newData);
			}
		}
	}

	ReadMissingBonesJson(animation, model)
	{
		var channelArray = animation.channels;
		var size = channelArray.length;

		var boneInfoMap = model.GetBoneInfoMap();//getting m_BoneInfoMap from Model class
		var boneCount = model.GetBoneCount(); //getting the m_BoneCounter from Model class

		//reading channels(bones engaged in an animation and their keyframes)
		for (var i = 0; i < size; i++)
		{
			var channel = channelArray[i];
			var boneName = channel.name;

			if (!boneInfoMap.has(boneName))
			{
				boneInfoMap.set(boneName, new BoneInfo())
				boneInfoMap.get(boneName).id = boneCount;
				boneCount++;
			}
			this.m_Bones.push(new Bone(boneName,
				boneInfoMap.get(boneName).id, channel));
		}

		this.m_BoneInfoMap = boneInfoMap;
	}
    
};
