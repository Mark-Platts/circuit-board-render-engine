
//Creates a circuit object that holds all of the components together and will be drawn to the div with id=home
//All args must be stringtype, dimensions require their unit of measurement
class Circuit {
    constructor(home, width, height, background = '#0f2d06') {
        //basic arguments for the circuit
        this.home = home;
        this.circName = home+'Circ';
        this.width = width;
        this.height = height;
        this.background = background;
        //locates the div to put the circuit in, creates the canvas, puts it in the div, saves the canvas variables for later use
        const target = document.getElementById(this.home);
        const arrow = `<canvas id=${this.circName} width=${this.width} height=${this.height} style="background-color:${this.background};"></canvas>`
        target.innerHTML = arrow;
        this.canvas = document.getElementById(this.circName);
        this.ctx = this.canvas.getContext("2d");
        this.components = {}; //storage for the components. name : component
        this.decorators = []; //storage for decorator objects
        this.orderOverride = []; //if this isn't empty then the components here will be updated first, use names
        this.extraInfo = false; //if changed to true using method, updates extraInfo in every component and updates. This adds info to the circuit for building purposes
        //for clickables
        this.clickables = {};
        this.clickHandler = this.canvas.addEventListener('click', (event) => { //used an arrow function here to get around 'this.' issues
            const clickX = event.offsetX;
            const clickY = event.offsetY;
            for (let i in this.clickables) {
                const boundaries = this.clickables[i].getBoundaries();
                if (clickX >= boundaries[0][0] && clickX <= boundaries[0][1] && clickY >= boundaries[1][0] && clickY <= boundaries[1][1]) {
                    this.clickables[i].onSwitch();
                    this.update();
                }
            }
        })
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    extraInfoOnOff() {
        this.extraInfo = this.extraInfo ? false : true;
    }
    addWire(name, points, on, dependencies = [[],[]]){
        this.components[name] =  new Wire(name, points, on, dependencies);
    }
    addSwitch(name, point, on, digit = 'off', size = 20) {
        this.clickables[name] = new Switch(name, point, on, digit, size);
    }
    addVInOut(point, direction, inOut, size = 5) {
        this.decorators.push(new VInOut(point, direction, inOut, size));
    }
    addResistor(point, height, width, color = '#6d2012') {
        this.decorators.push(new Resistor(point, height, width, color));
    }
    renderComponents() {
        for (let i in this.components) {
            this.components[i].render(this.ctx, this.extraInfo);
        }
        for (let i in this.clickables) {
            this.clickables[i].render(this.ctx, this.extraInfo);
        }
        for (let i in this.decorators) {
            this.decorators[i].render(this.ctx, this.extraInfo);
        }
    }
    update() {
        this.clearCanvas();
        this.renderComponents();
    }
}


//creates a wire object. name is a unique string, points is an array of arrays, denoting where each point of the wire is,
//on is bool for whether wire starts on or off.
//dependencies is an array of two arrays. The first lists components that must be on for this one to be on, the second list ones that must be off.
//wire uses OR logic for on dependencies, AND for off.
class Wire {
    constructor(name, points, on, dependencies) {
        this.name = name;
        this.points = points;
        this.on = on;
        this.dependencies = dependencies;
        this.changable = true; //lets the circuit logic know whether to check for update or not
    }
    render(ctx, extraInfo) {
        ctx.strokeStyle = (this.on ? '#ffff00' : '#375997');
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < this.points.length-1; i++) {
            const startCoord = this.points[i];
            const endCoord = this.points[i+1];
            ctx.moveTo(startCoord[0], startCoord[1]);
            ctx.lineTo(endCoord[0], endCoord[1]);
            ctx.stroke();
        }
    }
    onSwitch() {
        this.on = this.on ? false : true;
    }
}


//creates a switch object, name is unique string, point is array-coord for middle of the switch, on is bool
//digit: off, up, down, left, right as string, places a 0/1 relative to switch.
class Switch {
    constructor(name, point, on, digit, size) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.digit = digit;
        this.size = size;
        this.shapeStart = [this.point[0]-this.size/2, this.point[1]-this.size/2];
    }
    onSwitch() {
        this.on = this.on ? false : true;
    }
    getBoundaries() { //returns the start and end values for each dimension
        const xStart = this.shapeStart[0];
        const yStart = this.shapeStart[1];
        const xEnd = this.shapeStart[0] + this.size;
        const yEnd = this.shapeStart[1] + this.size;
        return([[xStart, xEnd], [yStart, yEnd]]);
    }
    render(ctx, extraInfo) {
        ctx.lineWidth = 2;
        ctx.fillStyle = (this.on ? '#262626' : '#787878');
        ctx.strokeStyle = '#808080';
        ctx.fillRect(this.shapeStart[0], this.shapeStart[1], this.size, this.size);
        ctx.strokeRect(this.shapeStart[0], this.shapeStart[1], this.size, this.size);
    }
}

//for decorator showing voltage going in or out
//point is location of tip that arrow is pointing towards as array
//direction: up, down, left, right as string
//inOut: true for in, otherwise will be out
class VInOut {
    constructor(point, direction, inOut, size) {
        this.point = point;
        this.direction = direction;
        this.inOut = inOut;
        this.size = size;
    }
    render(ctx, extraInfo) {
        const pathDirectionInfo = {
            'up': [this.point, [this.point[0]-this.size, this.point[1]+this.size], [this.point[0]+this.size, this.point[1]+this.size]],
            'down': [this.point, [this.point[0]-this.size, this.point[1]-this.size], [this.point[0]+this.size, this.point[1]-this.size]],
            'left': [this.point, [this.point[0]-this.size, this.point[1]-this.size], [this.point[0]-this.size, this.point[1]+this.size]],
            'right': [this.point, [this.point[0]+this.size, this.point[1]-this.size], [this.point[0]+this.size, this.point[1]+this.size]]
        }
        const pathInfo = pathDirectionInfo[this.direction];
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = (this.inOut ? '#ffff00' : '#000000');
        ctx.strokeStyle = (this.inOut ? '#ffff00' : '#808080');
        ctx.moveTo(pathInfo[0][0], pathInfo[0][1]);
        ctx.lineTo(pathInfo[1][0], pathInfo[1][1]);
        ctx.lineTo(pathInfo[2][0], pathInfo[2][1]);
        ctx.lineTo(pathInfo[0][0], pathInfo[0][1]);
        ctx.fill();
        ctx.stroke();
    }
}


//for resistance decorators
//point is location of middle of resistor
//direction: vertical, horizontal as string
class Resistor {
    constructor(point, height, width, color) {
        this.point = point;
        this.height = height;
        this.width = width;
        this.color = color;
    }
    render(ctx, extraInfo) {
        const shapeStart = [this.point[0]-this.width/2, this.point[1]-this.height/2];
        ctx.fillStyle = this.color;
        ctx.fillRect(shapeStart[0], shapeStart[1], this.height, this.width);
    }
}