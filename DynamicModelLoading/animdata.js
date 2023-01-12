function BoneInfo(){
	/*id is index in finalBoneMatrices*/
    this.id = -1;

	/*offset matrix transforms vertex from model space to bone space*/
    this.offset = mat4.create();
}
