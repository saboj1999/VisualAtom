class Plane extends Object
{
    constructor(x_scale, y_scale, x_triangle_count, y_triangle_count)
    {
        var plane_verts = createPlaneVertices(x_scale, y_scale, x_triangle_count, y_triangle_count);
        var plane_norms = calculatePlaneNormals(plane_verts);
        super(plane_verts, 3, plane_norms);
    }
}