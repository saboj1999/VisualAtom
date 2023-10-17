
const cubeVertices = [
    //Front
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -.5, 0.5),
    vec3(-.5, 0.5, 0.5),
    vec3(-.5, 0.5, 0.5),
    vec3(0.5, -.5, 0.5),
    vec3(-.5, -.5, 0.5),

    //Left
    vec3(-.5, 0.5, 0.5),
    vec3(-.5, -.5, 0.5),
    vec3(-.5, 0.5, -.5),
    vec3(-.5, 0.5, -.5),
    vec3(-.5, -.5, 0.5),
    vec3(-.5, -.5, -.5),

    //Back
    vec3(-.5, 0.5, -.5),
    vec3(-.5, -.5, -.5),
    vec3(0.5, 0.5, -.5),
    vec3(0.5, 0.5, -.5),
    vec3(-.5, -.5, -.5),
    vec3(0.5, -.5, -.5),

    //Right
    vec3(0.5, 0.5, -.5),
    vec3(0.5, -.5, -.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -.5, 0.5),
    vec3(0.5, -.5, -.5),

    //Top
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, -.5),
    vec3(-.5, 0.5, 0.5),
    vec3(-.5, 0.5, 0.5),
    vec3(0.5, 0.5, -.5),
    vec3(-.5, 0.5, -.5),

    //Bottom
    vec3(0.5, -.5, 0.5),
    vec3(0.5, -.5, -.5),
    vec3(-.5, -.5, 0.5),
    vec3(-.5, -.5, 0.5),
    vec3(0.5, -.5, -.5),
    vec3(-.5, -.5, -.5)
];

const cubeNormals = [
    //Front
    vec3(0, 0, 1),
    vec3(0, 0, 1),
    vec3(0, 0, 1),
    vec3(0, 0, 1),
    vec3(0, 0, 1),
    vec3(0, 0, 1),
        
    //Left
    vec3(-1, 0, 0),
    vec3(-1, 0, 0),
    vec3(-1, 0, 0),
    vec3(-1, 0, 0),
    vec3(-1, 0, 0),
    vec3(-1, 0, 0),

    //Back
    vec3(0, 0, -1),
    vec3(0, 0, -1),
    vec3(0, 0, -1),
    vec3(0, 0, -1),
    vec3(0, 0, -1),
    vec3(0, 0, -1),
        
    //Right
    vec3(1, 0, 0),
    vec3(1, 0, 0),
    vec3(1, 0, 0),
    vec3(1, 0, 0),
    vec3(1, 0, 0),
    vec3(1, 0, 0),

    //Top
    vec3(0, 1, 0),
    vec3(0, 1, 0),
    vec3(0, 1, 0),
    vec3(0, 1, 0),
    vec3(0, 1, 0),
    vec3(0, 1, 0),

    //Bottom
    vec3(0, -1, 0),
    vec3(0, -1, 0),
    vec3(0, -1, 0),
    vec3(0, -1, 0),
    vec3(0, -1, 0),
    vec3(0, -1, 0),
];

var gl;
var aspect;        
var projectionMatrix;
var vPositionLoc;
var colorLoc;
var MV_loc;
var P_loc;
var normals_Loc;
var N_loc;
var V_loc;
var program;

var left = -10;          
var right = 10;          
var bottom = -10;        
var topBound = 10;       
var near = -10;          
var far = 10;      

var fov = 110;
var nearCull = 1e-4;
var farCull = 1e4;

var cube_vbo_v;
var cube_vbo_n;
var cube;

var camera;

var degs = 0;

var grid = [];

var grid_density = 23;

function DegsToRads(degree) {
    var rad = degree * (Math.PI / 180);
    return rad;
}    

function createSphereVertices(radius, segments, rings) {
    const vertices = [];

    for (let i = 0; i <= rings; i++) {
        const phi = (i * Math.PI) / rings;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        for (let j = 0; j <= segments; j++) {
            const theta = (j * 2 * Math.PI) / segments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            const x = cosTheta * sinPhi;
            const y = cosPhi;
            const z = sinTheta * sinPhi;

            vertices.push(vec3(x * radius, y * radius, z * radius));
        }
    }

    return vertices;
}

function calculateSphereNormals(vertices) {
    const normals = [];

    for (let i = 0; i < vertices.length; i ++) {
        const x = vertices[i][0];
        const y = vertices[i][1];
        const z = vertices[i][2];

        // Calculate the normal vector by normalizing the vertex position
        const length = Math.sqrt(x * x + y * y + z * z);
        const normalX = x / length;
        const normalY = y / length;
        const normalZ = z / length;

        normals.push(vec3(normalX, normalY, normalZ));
    }

    return normals;
}

function createPlaneVertices(width, length, dX, dY)
{
    const z = 0;
    vertices = [];
    for(let x = 0; x < length; x+=dX)
    {
        for(let y = 0; y < width; y+=dY)
        {
            let x1 = x;
            let y1 = y;
            let z1 = z;

            let x2 = x + dX;
            let y2 = y + dY;
            let z2 = z;

            let x3 = x + dX;
            let y3 = y;
            let z3 = z;

            let x5 = x;
            let y5 = y + dY;
            let z5 = z;

            vertices.push(vec3(x1, y1, z1));
            vertices.push(vec3(x2, y2, z2));
            vertices.push(vec3(x3, y3, z3));
            vertices.push(vec3(x1, y1, z1));
            vertices.push(vec3(x5, y5, z5));
            vertices.push(vec3(x2, y2, z2));
        }
    }
    return vertices;
}

function calculatePlaneNormals(vertices)
{
    var normals = [];
    for(let i = 0; i < vertices.length; i++)
    {
        normals.push(vec3(0, 0, 1));
    }
    return normals;
}

function create3DGrid()
{
    for(var i = 0; i < grid_density; i++)
    {
        // make new list for this i
        var i_list = [];

        for(var j = 0; j < grid_density; j++)
        {
            // make new list for this i,j
            var j_list = [];

            for(var k = 0; k < grid_density; k++)
            {
                let next_cube = new Cube();
                next_cube.setScale(1.25, 1.25, 1.25);
                next_cube.setPosition((i - grid_density/2)*1.25, (j - grid_density/2)*1.25, (k - grid_density/2)*1.25);
                let alpha = calculateProbability(next_cube);
                console.log(alpha);
                alpha < .075 ? alpha = 0 : alpha += 4*alpha;
                let radius = Math.sqrt(
                    Math.pow(next_cube.position[0], 2) +
                    Math.pow(next_cube.position[1], 2) +
                    Math.pow(next_cube.position[2], 2)
                );
                let red = 0;
                let green = 0;
                let blue = 0;
                radius > 11 ? red = 1 : green = 1;
                radius > 13 ? alpha = 0 : alpha = alpha;
                
                next_cube.setColor(red, green, blue, alpha);
                radius < 2 ? next_cube.setColor(0, 0, 1, 1) : console.log("");
                j_list.push(next_cube);
            }

            // push to i list
            i_list.push(j_list);
        }

        // push to grid
        grid.push(i_list);
    }

}

function draw3DGrid()
{
    for(var i = 0; i < grid_density/2; i++)
    {
        for(var j = 0; j < grid_density; j++)
        {
            for(var k = 0; k < grid_density; k++)
            {
                grid[i][j][k].draw();
            }
        }
    }
}


// ground state -> hydrogen atom
// psi_1_0_0 = (2/a_o^(3/2))e^(-r/a_o)(1/sqrt(4pi))
function calculateProbability(cube)
{
    // Calculate the radial distance (r) from the origin
    const r = Math.sqrt(
        Math.pow(cube.position[0], 2) +
        Math.pow(cube.position[1], 2) +
        Math.pow(cube.position[2], 2)
    );

    // Define constants
    const a0 = 3; // Bohr radius (you can adjust this as needed)
    const numSteps = 1000;

    // Function to calculate the squared wavefunction |Ψ₁₀₀(r)|² for a given radius r
    function squaredWavefunction(r) {
        return (1 / Math.PI) * (1 / Math.pow(a0, 3)) * Math.exp(-2 * r / a0);
    }

    // Numerical integration to calculate the radial probability
    function integrateRadialProbability() {
        let integral = 0;

        // Perform numerical integration using the trapezoidal rule
        for (let i = 0; i <= r; i += r / numSteps) {
            integral += squaredWavefunction(i) * i * i;
        }

        return integral * (r / numSteps);
    }

    // Calculate the radial probability for the specified position
    const radialProbability = integrateRadialProbability();

    // Ensure the result is within the [0, 1] range
    const probability = Math.min(1, Math.max(0, radialProbability));

    return probability;
}

window.onload = function init()
{

    var canvas = document.getElementById( "canvas" ); 
    
    gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: false,
      });                   
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport(0, 0, canvas.width, canvas.height);  
    // gl.clearColor( 0.0, 0.0, 0.0, 1.0 );  
    // gl.enable(gl.DEPTH_TEST);   
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    

    // Create shader program
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    // program = initShaders( gl, "dl-vertex-shader", "dl-fragment-shader" ); 
    gl.useProgram(program); 
        
    aspect = canvas.width / canvas.height;
    left  *= aspect;                                  
    right *= aspect;    
    projectionMatrix = ortho(left, right, bottom, topBound, near, far*10); 
    projectionMatrix = perspective(fov, aspect, nearCull, farCull);

    colorLoc = gl.getUniformLocation(program, "color");  
    MV_loc = gl.getUniformLocation(program, "MV");
    vPositionLoc = gl.getAttribLocation(program, "vPosition");  
    P_loc = gl.getUniformLocation(program, "P"); 
    // normals_Loc = gl.getUniformLocation(program, "vNormal");
    // N_loc = gl.getUniformLocation(program, "N");
    V_loc = gl.getUniformLocation(program, "V");

    gl.uniformMatrix4fv(P_loc, false, flatten(projectionMatrix));      

    //////////////////////////////////////////////////////////////
    cube_vbo_v = Vbo(gl, cubeVertices, 3);
    cube_vbo_n = Vbo(gl, cubeNormals, 3);

    cube_vbo_n.BindToAttribute(normals_Loc);                  
    cube_vbo_v.BindToAttribute(vPositionLoc);

    // ==== Create Grid ====
    create3DGrid();

    // ==== Create Camera ====
    camera = new Camera();
    camera.setPosition(15, 5, 0);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);                            
    
    camera.update();
    // camera.lookAt(cube.position);
    camera.setPosition(18*Math.cos(degs/50), 5, 18*Math.sin(degs/50));
    camera.lookAt(vec3(0,0,0));

    degs += 2;

    draw3DGrid();

    requestAnimationFrame(render);                           
}
