#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCord;
in ivec4 vBoneIds; 
in vec4 vWeights;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

const int MAX_BONES = 100;
const int MAX_BONE_INFLUENCE = 4;
uniform mat4 finalBonesMatrices[MAX_BONES];

out vec2 TexCoords;
out vec3 Normal;
out vec3 FragPos;

void main()
{
    vec4 totalPosition = vec4(0.0f);
    vec3 totalNormal = vec3(0.0f);
    for(int i = 0 ; i < MAX_BONE_INFLUENCE ; i++)
    {
        if(vBoneIds[i] == -1) 
            continue;
        if(vBoneIds[i] >=MAX_BONES) 
        {
            totalPosition = vec4(vPosition,1.0f);
            totalNormal = vNormal;
            break;
        }
        vec4 localPosition = finalBonesMatrices[vBoneIds[i]] * vec4(vPosition,1.0f);
        totalPosition += localPosition * vWeights[i];
        vec3 localNormal = mat3(finalBonesMatrices[vBoneIds[i]]) * vNormal;
        totalNormal += localNormal * vWeights[i];
    }
	
	TexCoords = vTexCord;
    Normal = totalNormal;

    gl_Position =  projection * view * model * totalPosition;    
}