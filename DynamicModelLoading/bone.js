
function KeyPosition()
{
	this.position = vec3.create();
	this.timeStamp = 0.0;
};

function KeyRotation()
{
	this.orientation = quat.create();
	this.timeStamp = 0.0;
};

function KeyScale()
{
	this.scale = vec3.create();
	this.timeStamp = 0.0;
};

class Bone
{
	m_Positions;
	m_Rotations;
	m_Scales;
	m_NumPositions;
	m_NumRotations;
	m_NumScalings;

	m_LocalTransform;
	m_Name;
	m_ID;
    
	constructor(name, ID, channel)
	{		
		this.m_Positions = [];
		this.m_Rotations = [];
		this.m_Scales = [];
		this.m_NumPositions = 0;
		this.m_NumRotations = 0;
		this.m_NumScalings = 0;

        this.m_Name = name;
        this.m_ID = ID;
        this.m_LocalTransform = mat4.create();

		var positionArray = channel.positionkeys;
		this.m_NumPositions = positionArray.length;

		for (var positionIndex = 0; positionIndex < this.m_NumPositions; ++positionIndex)
		{
			var data = new KeyPosition();
			var positionVec3 =  positionArray[positionIndex][1];
			for (var j = 0; j < 3; j++)
			{
				data.position[j] = parseFloat(positionVec3[j]);
			}

			var timeStamp = parseFloat(positionArray[positionIndex][0]);
			data.timeStamp = timeStamp;
			this.m_Positions.push(data);
		}

		var rotationArray = channel.rotationkeys;

		this.m_NumRotations = rotationArray.length;

		for (var rotationIndex = 0; rotationIndex < this.m_NumRotations; ++rotationIndex)
		{
			var data = new KeyRotation();
			var rotationQuat4 = rotationArray[rotationIndex][1];

			quat.set(data.orientation, rotationQuat4[1], rotationQuat4[2], rotationQuat4[3], rotationQuat4[0]);
			
			var timeStamp = parseFloat(rotationArray[rotationIndex][0]);
			data.timeStamp = timeStamp;
			this.m_Rotations.push(data);
		}

		var scaleArray = channel.scalingkeys;

		this.m_NumScalings = scaleArray.length;

		for (var keyIndex = 0; keyIndex < this.m_NumScalings; ++keyIndex)
		{
			var data = new KeyScale();
			var scaleVec3 = scaleArray[keyIndex][1];
			for (var j = 0; j < 3; j++)
			{
				data.scale[j] = parseFloat(scaleVec3[j]);
			}

			var timeStamp = parseFloat(scaleArray[keyIndex][0]);
			data.timeStamp = timeStamp;
			this.m_Scales.push(data);
		}

	}

	Update(animationTime)
	{
		var translation = this.InterpolatePosition(animationTime);
		var rotation = this.InterpolateRotation(animationTime);
		var scale = this.InterpolateScaling(animationTime);

		mat4.identity(this.m_LocalTransform);

		mat4.multiply(this.m_LocalTransform, this.m_LocalTransform, translation);
		mat4.multiply(this.m_LocalTransform, this.m_LocalTransform, rotation);
		mat4.multiply(this.m_LocalTransform, this.m_LocalTransform, scale);
	}

	GetLocalTransform() { return this.m_LocalTransform; }
	GetBoneName() { return this.m_Name; }
	GetBoneID() { return this.m_ID; }

	GetPositionIndex(animationTime)
	{
		for (var index = 0; index < this.m_NumPositions - 1; ++index)
		{
			if (animationTime < this.m_Positions[index + 1].timeStamp)
				return index;
		}
		return -1;
	}

	GetRotationIndex(animationTime)
	{
		for (var index = 0; index < this.m_NumRotations - 1; ++index)
		{
			if (animationTime < this.m_Rotations[index + 1].timeStamp)
				return index;
		}
		return -1;
	}

	GetScaleIndex(animationTime)
	{
		for (var index = 0; index < this.m_NumScalings - 1; ++index)
		{
			if (animationTime < this.m_Scales[index + 1].timeStamp)
				return index;
		}
		return -1;
	}

	GetScaleFactor(lastTimeStamp, nextTimeStamp, animationTime)
	{
		var scaleFactor = 0.0;
		var midWayLength = parseFloat(animationTime) - parseFloat(lastTimeStamp);
		var framesDiff = parseFloat(nextTimeStamp) - parseFloat(lastTimeStamp);
		scaleFactor = parseFloat(midWayLength) / parseFloat(framesDiff);
		return parseFloat(scaleFactor);
	}

	InterpolatePosition(animationTime)
	{
		var position = mat4.create();
		if (1 == this.m_NumPositions || animationTime >= this.m_Positions[this.m_Positions.length - 1].timeStamp)
		{			
			mat4.translate(position, position, this.m_Positions[0].position);
			return position;
		}

		var p0Index = this.GetPositionIndex(animationTime);
		var p1Index = p0Index + 1;
		var scaleFactor = this.GetScaleFactor(this.m_Positions[p0Index].timeStamp,
			this.m_Positions[p1Index].timeStamp, animationTime);
		var finalPosition = mix(this.m_Positions[p0Index].position, this.m_Positions[p1Index].position
			, scaleFactor);
		mat4.translate(position, position, finalPosition);
		return position;
	}

	InterpolateRotation(animationTime)
	{
		var rotationMat4 = mat4.create();
		if (1 == this.m_NumRotations || animationTime >= this.m_Rotations[this.m_Rotations.length - 1].timeStamp)
		{
			var rotation = quat.create();
			quat.normalize(rotation, this.m_Rotations[0].orientation);
			mat4.fromQuat(rotationMat4, rotation);
			return rotationMat4;
		}

		var p0Index = this.GetRotationIndex(animationTime);
		var p1Index = p0Index + 1;
		var scaleFactor = this.GetScaleFactor(this.m_Rotations[p0Index].timeStamp,
			this.m_Rotations[p1Index].timeStamp, animationTime);
		var finalRotation = quat.create();
		quat.slerp(finalRotation, this.m_Rotations[p0Index].orientation, this.m_Rotations[p1Index].orientation
			, scaleFactor);
		mat4.fromQuat(rotationMat4, finalRotation);
		return rotationMat4;

	}

    InterpolateScaling(animationTime)
	{
		var scaleMat4 = mat4.create();
		if (1 == this.m_NumScalings || animationTime >= this.m_Scales[this.m_Scales.length - 1].timeStamp)
		{
			mat4.scale(scaleMat4, scaleMat4, this.m_Scales[0].scale);
			return scaleMat4;
		}

		var p0Index = this.GetScaleIndex(animationTime);
		var p1Index = p0Index + 1;
		var scaleFactor = this.GetScaleFactor(this.m_Scales[p0Index].timeStamp,
			this.m_Scales[p1Index].timeStamp, animationTime);
		var finalScale = mix(this.m_Scales[p0Index].scale, this.m_Scales[p1Index].scale
			, scaleFactor);
		mat4.scale(scaleMat4, scaleMat4, finalScale);
		return scaleMat4;
	}

};
