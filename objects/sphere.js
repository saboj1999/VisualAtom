class Sphere extends Object
{
    constructor(radius, segments, rings)
    { 
        var vertices = createSphereVertices(radius, segments, rings);
        var normals = calculateSphereNormals(vertices);
        super(vertices, 3, normals);
        this.setDrawMode(gl.TRIANGLE_FAN);
    }
}