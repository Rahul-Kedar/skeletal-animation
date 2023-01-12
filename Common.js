
const WebGLMacros = 
{
    AMC_ATRRIBUTE_POSITION : 0,
    AMC_ATTRIBUTE_COLOR : 1,
    AMC_ATTRIBUTE_NORMAL : 2,
    AMC_ATTRIBUTE_TEXCORD : 3,
    AMC_ATTRIBUTE_BONEID : 4,
    AMC_ATTRIBUTE_WEIGHTS : 5
};

function readFile(file)
{
	var result;
	var f = new XMLHttpRequest();
	f.open("GET", file, false);
	f.onload = function () {
	if (f.readyState === 4) {
		if (f.status === 200 || f.status == 0) {
			result = f.responseText;
		}
	}
	}
	f.send(null);
	return result;
}

function mix(x, y, a)
{
	var vec = [0.0, 0.0, 0.0];
	for(var i = 0; i < 3; i++)
	{
		vec[i] = x[i] * (1.0 - a) + y[i] * a;
	}
	return vec;
}
