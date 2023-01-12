class Material
{
    m_name;

    m_color_diffuse;
    m_color_specular;
    m_color_ambient;
    m_color_emissive;

    m_shininess;

    m_tex_file;

    constructor(material)
    {        
        this.m_name = "";

        this.m_color_diffuse = vec3.create();
        this.m_color_specular = vec3.create();
        this.m_color_ambient = vec3.create();
        this.m_color_emissive = vec3.create();

        this.m_shininess = 0;

        this.m_tex_file = "";

        for(let i = 0; i < material.properties.length; i++)
        {
            switch(material.properties[i].key)
            {
                case "?mat.name":
                    this.m_name = material.properties[i].value;
                    break;
                    
                case "$clr.diffuse":
                    this.m_color_diffuse = material.properties[i].value;
                    break;
                    
                case "$clr.emissive":
                    this.m_color_emissive = material.properties[i].value;
                    break;
                    
                case "$clr.ambient":
                    this.m_color_ambient = material.properties[i].value;
                    break;
                    
                case "$clr.specular":
                    this.m_color_specular = material.properties[i].value;
                    break;
                    
                case "$mat.shininess":
                    this.m_shininess = material.properties[i].value;
                    break;
                    
                case "$tex.file":
                    let path = material.properties[i].value;
                    this.m_tex_file = path.substring(path.lastIndexOf('\\') + 1);
                    break;
            }
        }
    }
}