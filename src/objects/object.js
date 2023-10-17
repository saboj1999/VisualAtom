class Object
{
    dim;
    vertices;
    normals;
    vbo_v;
    vbo_n;
    position;
    rotation;
    scale;
    color;

    m_rotation_x;
    m_rotation_y;
    m_rotation_z;
    m_scale;
    m_translate;
    m_modelView;
    m_normal;

    drawMode;

    constructor(vertices, dim, normals, vbo_v, vbo_n)
    {
        this.vertices = vertices;
        this.position = vec3(0,0,0);
        this.rotation = vec3(0,0,0);
        this.scale = vec3(1,1,1);
        this.color = vec4(1,0,0,1);
        this.dim = dim; 
        this.normals = normals;
        
        this.vbo_v = vbo_v;
        this.vbo_n = vbo_n;

        this.m_translate = translate(0.0, 0.0, 0.0);     
        this.m_scale = scale(1.0, 1.0, 1.0);     
        this.m_rotation_x = rotate(0, vec3(1.0, 0.0, 0.0));
        this.m_rotation_y = rotate(0, vec3(0.0, 1.0, 0.0));
        this.m_rotation_z = rotate(0, vec3(0.0, 0.0, -1.0));
        this.updateModelView();
        this.m_normal = normalMatrix(this.m_modelView, true);
        
        this.drawMode = gl.TRIANGLES;
    }

    setPosition(x, y, z)
    {
        this.position = vec3(x, y, z);
        this.m_translate = translate(x, y, z);
    }

    setScale(x, y, z)
    {
        this.scale = vec3(x, y, z);
        this.m_scale = scale(x, y, z);                            
    }

    setColor(r, g, b, a)
    {
        this.color = vec4(r, g, b, a);
    }

    setDrawMode(mode)
    {
        this.drawMode = mode;
    }


    // keep vectors of local xyz directions in order to perform local rotations
    // vs pivot rotation :-> can rotate around specific vectors
    // pivots being supply any world coord along with degs and pivot around it
    rotateX(degs)
    {
        var R1 = rotate(degs, vec3(1.0, 0.0, 0.0));
        var T = translate(this.position[0], this.position[1], this.position[2]);
        var positionI = negate(this.position);
        var TI = translate(positionI[0], positionI[1], positionI[2]);

        this.m_rotation_x = mult(T, mult(R1, TI)); 
    }

    rotateY(degs)
    {
        var R1 = rotate(degs, vec3(0.0, 1.0, 0.0));
        var T = translate(this.position[0], this.position[1], this.position[2]);
        var positionI = negate(this.position);
        var TI = translate(positionI[0], positionI[1], positionI[2]);

        this.m_rotation_y = mult(T, mult(R1, TI)); 
    }

    rotateZ(degs)
    {
        var R1 = rotate(degs, vec3(0.0, 0.0, -1.0));
        var T = translate(this.position[0], this.position[1], this.position[2]);
        var positionI = negate(this.position);
        var TI = translate(positionI[0], positionI[1], positionI[2]);

        this.m_rotation_z = mult(T, mult(R1, TI));  
    }

    updateModelView()
    {
        var m_rotation = mult(this.m_rotation_z, mult(this.m_rotation_y, this.m_rotation_x));
        this.m_modelView = mult(this.m_translate, this.m_scale);                    
        this.m_modelView = mult(m_rotation, this.m_modelView);
    }

    draw()
    {
        this.updateModelView();
        // this.m_normal = normalMatrix(this.m_modelView, true);
        
        gl.uniform4f(colorLoc, this.color[0], this.color[1], this.color[2], this.color[3]);
        // this.vbo_n.BindToAttribute(normals_Loc);                  
        // this.vbo_v.BindToAttribute(vPositionLoc);
        // gl.uniformMatrix3fv(N_loc, false, flatten(this.m_normal));  
        gl.uniformMatrix4fv(MV_loc, false, flatten(this.m_modelView)); 
        gl.drawArrays(this.drawMode, 0, this.vertices.length); 
    }

    copy()
    {
        // This could be way better
        return new Object(this.vertices, this.dim, this.normals, this.vbo_v, this.vbo_n);
    }


}