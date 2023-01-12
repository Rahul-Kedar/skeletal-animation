class Animator
{    
	m_FinalBoneMatrices;
	m_CurrentAnimation;
	m_CurrentTime;
	m_DeltaTime;

	constructor(animation)
	{
		this.m_CurrentTime = 0.0;
		this.m_CurrentAnimation = animation;
		this.m_DeltaTime = 0;
		this.m_FinalBoneMatrices = [];

		for (var i = 0; i < 100; i++)
            this.m_FinalBoneMatrices.push(mat4.create());
	}

	UpdateAnimation(dt)
	{
		this.m_DeltaTime = dt;
		if (this.m_CurrentAnimation)
		{
			this.m_CurrentTime += this.m_CurrentAnimation.GetTicksPerSecond() * dt;
			this.m_CurrentTime = Math.fmod(this.m_CurrentTime, this.m_CurrentAnimation.GetDuration());
			this.CalculateBoneTransform(this.m_CurrentAnimation.GetRootNode(), mat4.create());
		}
	}

	PlayAnimation(pAnimation)
	{
		this.m_CurrentAnimation = pAnimation;
		this.m_CurrentTime = 0.0;
	}

	CalculateBoneTransform(node, parentTransform)
	{
		var nodeName = node.name;
		var nodeTransform = node.transformation;

		var Bone = this.m_CurrentAnimation.FindBone(nodeName);

		if (Bone)
		{
			Bone.Update(this.m_CurrentTime);
			nodeTransform = Bone.GetLocalTransform();
		}

		var globalTransformation = mat4.create();
		mat4.multiply(globalTransformation, parentTransform, nodeTransform);


		var boneInfoMap = this.m_CurrentAnimation.GetBoneIDMap();
		if (boneInfoMap.has(nodeName))
		{
			var index = boneInfoMap.get(nodeName).id;
			var offset = boneInfoMap.get(nodeName).offset;
			
			var boneMatrix = mat4.create();
			mat4.multiply(boneMatrix, globalTransformation, offset);
			this.m_FinalBoneMatrices[index] = boneMatrix;
			
		}

		for (var i = 0; i < node.childrenCount; i++)
			this.CalculateBoneTransform(node.children[i], globalTransformation);
	}

	GetFinalBoneMatrices()
	{
		return this.m_FinalBoneMatrices;
	}
	
}

Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };


function fmod(a, b){
	var x = Math.floor(a/b);
	return a - b*x;
} 