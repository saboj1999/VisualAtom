class Camera
{

    // implement idea of world position and local position;
    position;

    m_translate;
    m_rotation_x;
    m_rotation_y;
    m_rotation_z;

    m_view;

    constructor()
    {
        this.position = vec3(0, 0, 10);
        this.m_translate = translate(0, 0, 10);
        this.m_view = inverse(this.m_translate);
        gl.uniformMatrix4fv(V_loc, false, flatten(this.m_view));  

        this.m_rotation_x = rotate(0, vec3(1, 0, 0));
        this.m_rotation_y = rotate(0, vec3(0, 1, 0));
        this.m_rotation_z = rotate(0, vec3(0, 0, -1));
    }

    update()
    {
        this.updateView();
        gl.uniformMatrix4fv(V_loc, false, flatten(this.m_view));  
    }

    updateView()
    {
        var m_rotation = mult(this.m_rotation_z, mult(this.m_rotation_y, this.m_rotation_x));
        this.m_view = mult(this.m_translate, m_rotation);    
        this.m_view = inverse(this.m_view);
    }

    setPosition(x, y, z)
    {
        this.position = vec3(x, y, z);
        this.m_translate = translate(x, y, z);
    }

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


    lookAt(target) {

        // let up = cross(this.position, vec3(target - this.position));
        this.m_view = lookAt(this.position, target, vec3(0,1,0));
        gl.uniformMatrix4fv(V_loc, false, flatten(this.m_view));
    }

}