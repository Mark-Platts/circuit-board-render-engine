
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
        this.timerStore = {}; //stores any setIntervals set up by timers
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
        //for technical things
        this.showCoords = false; //turn true to have coord data shown for each component
        })
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    extraInfoOnOff() {
        this.extraInfo = this.extraInfo ? false : true;
    }
    addWire(name, points, on, onDeps = [], offDeps = []){
        this.components[name] =  new Wire(name, points, on, onDeps, offDeps);
    }
    addCircleBulb(name, point, on, onDeps = [], digit = 'off', size = 14) {
        this.components[name] =  new CircleBulb(name, point, on, onDeps, digit, size);
    }
    addTransistor(name, point, on, onDeps = [], direction = 'down', size = 14) {
        this.components[name] = new Transistor(name, point, on, onDeps, direction, size);
    }
    addNOTGateFull(name, point, on, onDep, direction = 'down', size = 14, color = '#808080') {
        this.components[name] = new NOTGateFull(name, point, on, onDep, direction, size, color);
    }
    addANDGateFull(name, point, on, onDeps, direction = 'down', size = 14, color = '#808080') {
        this.components[name] = new ANDGateFull(name, point, on, onDeps, direction, size, color);
    }
    addORGateFull(name, point, on, onDeps, direction = 'down', size = 14, color = '#808080') {
        this.components[name] = new ORGateFull(name, point, on, onDeps, direction, size, color);
    }
    addORGate(name, point, on, onDeps, direction = 'right', size = 18, color = '#808080') {
        this.components[name] = new ORGate(name, point, on, onDeps, direction, size, color);
    }
    addNOTGate(name, point, on, onDep, direction = 'right', size = 18, color = '#808080') {
        this.components[name] = new NOTGate(name, point, on, onDep, direction, size, color);
    }
    addANDGate(name, point, on, onDeps, direction = 'right', size = 18, color = '#808080') {
        this.components[name] = new ANDGate(name, point, on, onDeps, direction, size, color);
    }
    addBasicTimer(name, point, freq, on, dep, size = 40) {
        this.components[name] = new BasicTimer(name, this, this.updateAllLogic, point, freq, on, dep, size);
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
    addWireGaps(points) {
        for (let i of points) {
            this.decorators.push(new WireGap(i));
        }
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
    updateAllLogic() {
        let change = true;  //this keeps track of whether a change occurs in the system  //TEST BREAK HERE WHEN WORKING
        while (change) {
            for (let i of this.orderOverride) {
                const startOn = this.components[i].on;
                this.components[i].updateLogic(this.components, this.clickables);
                if (startOn != this.components[i].on) {
                    change = true;
                    break;
                }
                else {
                    change = false;
                }
            }
            for (let i in this.components) {
                const startOn = this.components[i].on;
                this.components[i].updateLogic(this.components, this.clickables);
                if (startOn != this.components[i].on) {
                    change = true;
                    break;
                }
                else {
                    change = false;
                }
            }
        }
    }
    update() {
        this.clearCanvas();
        this.updateAllLogic();
        this.renderComponents();
    }
}


//creates a wire object. name is a unique string, points is an array of arrays, denoting where each point of the wire is,
//on is bool for whether wire starts on or off.
//onDeps/offDeps are arrays. The first lists components that must be on for this one to be on, the second list ones that must be off.
//wire uses OR logic for on dependencies, AND for off.
class Wire {
    constructor(name, points, on, onDeps, offDeps) {
        this.name = name;
        this.points = points;
        this.on = on;
        this.onDeps = onDeps;
        this.offDeps = offDeps;
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
    updateLogic(components, clickables) {
        let hold = false;
        for (let i of this.onDeps) { //for each of the on dependencies
            if (i in components) { //see if the dependency is in components
                if (components[i].on) { //if so, check if the component is on
                    hold = true;  //if it is then the wire should turn on
                }
            }
            else if (i in clickables) { //if dependency is not in components, check clickables
                if (clickables[i].on) {
                    hold = true;  
                }
            }
        }
        for (let i of this.offDeps) { //for each of the off dependencies
            if (i in components) { //see if the dependency is in components
                if (components[i].on) { //if so, check if the component is on
                    hold = true;  //if it is then the wire should not turn on
                }
            }
            else if (i in clickables) { //if dependency is not in components, check clickables
                if (clickables[i].on) {
                    hold = true;  
                }
            }
        }
        this.on = hold;
    }
}





//for circular bulb component
//point is middle of bulb as array coord
//onDep is array with names of on dependancies, work with OR logic
//size is radius
class CircleBulb {
    constructor(name, point, on, onDeps, digit, size) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDeps = onDeps;
        this.digit = digit;
        this.size = size;
    }
    updateLogic(components, clickables) {
        let hold = false;

        for (let i of this.onDeps) { //for each of the on dependencies
            if (i in components) { //see if the dependency is in components
                if (components[i].on) { //if so, check if the component is on
                    hold = true;  //if it is then the wire should turn on
                }
            }
            else if (i in clickables) { //if dependency is not in components, check clickables
                if (clickables[i].on) {
                    hold = true;  
                }
            }
        }
        this.on = hold;
    }
    render(ctx, extraInfo) {
        ctx.lineWidth = 2;
        ctx.fillStyle = (this.on ? '#ffffff' : '#000000');
        ctx.strokeStyle = '#808080';
        ctx.beginPath();
        ctx.arc(this.point[0], this.point[1], this.size, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        const sizeFactor = this.size*1.60;
        if (this.digit != 'off') {
            ctx.font = String(this.size) + "px monospace";
            ctx.fillStyle = '#ffffff'
            const text = this.on ? '1' : '0';
            if (this.digit == 'up') {
                ctx.fillText(text, this.point[0] - sizeFactor/4, this.point[1] - sizeFactor);
            }
            else if (this.digit == 'down') {
                ctx.fillText(text, this.point[0] - sizeFactor/4, this.point[1] + sizeFactor*5/4);
            }
            else if (this.digit == 'left') {
                ctx.fillText(text, this.point[0] - sizeFactor*5/4, this.point[1] + sizeFactor/4);
            }
            else if (this.digit == 'right') {
                ctx.fillText(text, this.point[0] + sizeFactor*3/4, this.point[1] + sizeFactor/4);
            }
        }
    }
}

//For transistors
//point is centre as array coords, should take 2 for onDep, each being the name of the dependency
//direction is way arrow points 'down' is default.
class Transistor {
    constructor(name, point, on, onDeps, direction, size) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDeps = onDeps;
        this.direction = direction;
        this.size = size;
    }
    updateLogic(components, clickables) {
        let hold = true;
        for (let i of this.onDeps) { //for each of the on dependencies
            if (i in components) { //see if the dependency is in components
                if (components[i].on == false) { //if so, check if the component is on
                    hold = false;  //if it is then the wire should turn on
                }
            }
            else if (i in clickables) { //if dependency is not in components, check clickables
                if (clickables[i].on == false) {
                    hold = false;  
                }
            }
        }
        if (this.onDeps.length != 2) {
            hold = false;
        }
        this.on = hold;
    }
    render(ctx, extraInfo) {
        ctx.lineWidth = 2;
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.point[0], this.point[1], this.size, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = (this.on ? '#ffff00' : '#ffffff');
        ctx.beginPath();
        if (this.direction == 'up') {
            ctx.moveTo(this.point[0], this.point[1]+this.size*3/4);
            ctx.lineTo(this.point[0], this.point[1]-this.size*3/4);
            ctx.lineTo(this.point[0]+this.size/4, this.point[1]-this.size*2/4);
            ctx.lineTo(this.point[0]-this.size/4, this.point[1]-this.size*2/4);
            ctx.lineTo(this.point[0], this.point[1]-this.size*3/4);
        }
        if (this.direction == 'down') {
            ctx.moveTo(this.point[0], this.point[1]-this.size*3/4);
            ctx.lineTo(this.point[0], this.point[1]+this.size*3/4);
            ctx.lineTo(this.point[0]+this.size/4, this.point[1]+this.size*2/4);
            ctx.lineTo(this.point[0]-this.size/4, this.point[1]+this.size*2/4);
            ctx.lineTo(this.point[0], this.point[1]+this.size*3/4);
        }
        if (this.direction == 'left') {
            ctx.moveTo(this.point[0]+this.size*3/4, this.point[1]);
            ctx.lineTo(this.point[0]-this.size*3/4, this.point[1]);
            ctx.lineTo(this.point[0]-this.size*2/4, this.point[1]+this.size/4);
            ctx.lineTo(this.point[0]-this.size*2/4, this.point[1]-this.size/4);
            ctx.lineTo(this.point[0]-this.size*3/4, this.point[1]);
        }
        if (this.direction == 'right') {
            ctx.moveTo(this.point[0]-this.size*3/4, this.point[1]);
            ctx.lineTo(this.point[0]+this.size*3/4, this.point[1]);
            ctx.lineTo(this.point[0]+this.size*2/4, this.point[1]+this.size/4);
            ctx.lineTo(this.point[0]+this.size*2/4, this.point[1]-this.size/4);
            ctx.lineTo(this.point[0]+this.size*3/4, this.point[1]);
        }
        ctx.stroke();
    }
}


//Not Gate in terms of circuitry
//point is array coord in centre of surrounding rectangle
//for now only 'down' direction supported
//size is radius of transistor
//onDep is name of the on dependency
//color is for border
class NOTGateFull {
    constructor(name, point, on, onDep, direction, size, color) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDep = onDep;
        this.direction = direction;
        this.size = size;
        this.color = color;
    }
    updateLogic(components, clickables) {
        this.on = false;
        if (this.onDep in components) { //see if the dependency is in components
            this.on = !components[this.onDep].on
        }
        else if (this.onDep in clickables) { //if dependency is not in components, check clickables
            this.on = !clickables[this.onDep].on
        }
    }
    render(ctx, extraInfo) {
        const x = this.point[0];
        const y = this.point[1];
        const l = this.size;
        //border
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.point[0] - 2*this.size, this.point[1] - 4*this.size, 4*this.size, 8*this.size);
        //wires
        const arrowColor = this.on ? '#ffffff' : '#ffff00';
        const mainWireColor = this.on ? '#375997' : '#ffff00';
        const otherWireColor = this.on ?  '#ffff00' : '#375997';
        ctx.strokeStyle = otherWireColor;
        ctx.beginPath();
        ctx.moveTo(x - l/2, y - 2*l);
        ctx.lineTo(x + 1.5*l, y - 2*l);
        ctx.lineTo(x + 1.5*l, y);
        ctx.lineTo(x + 2.5*l, y);
        ctx.stroke();
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(x - l/2, y - 3*l);
        ctx.lineTo(x - l/2, y - 2*l);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - l/2, y - 2*l);
        ctx.strokeStyle = mainWireColor;
        ctx.lineTo(x - l/2, y + 3*l);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - l, y);
        ctx.lineTo(x - 2.5*l, y);
        ctx.stroke();
        //transistor
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - l/2, y, l, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = arrowColor;
        ctx.beginPath();
        ctx.moveTo(x - l/2, y-l*3/4);
        ctx.lineTo(x - l/2, y+l*3/4);
        ctx.lineTo(x - l/2+l/4, y+l*2/4);
        ctx.lineTo(x - l/2-l/4, y+l*2/4);
        ctx.lineTo(x - l/2, y+l*3/4);
        ctx.stroke();
        //decorators
        //VIn
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ffff00';
        const pathInfo1 = [[x - l/2, y - 3*l], [x - l, y - 3*l -l/2], [x, y - 3*l -l/2]];
        ctx.moveTo(pathInfo1[0][0], pathInfo1[0][1]);
        ctx.lineTo(pathInfo1[1][0], pathInfo1[1][1]);
        ctx.lineTo(pathInfo1[2][0], pathInfo1[2][1]);
        ctx.lineTo(pathInfo1[0][0], pathInfo1[0][1]);
        ctx.fill();
        ctx.stroke();
        //VOut
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#808080';
        const pathInfo2 = [[x - l/2, y + 3*l + l/2], [x - l, y + 3*l], [x, y + 3*l]];
        ctx.moveTo(pathInfo2[0][0], pathInfo2[0][1]);
        ctx.lineTo(pathInfo2[1][0], pathInfo2[1][1]);
        ctx.lineTo(pathInfo2[2][0], pathInfo2[2][1]);
        ctx.lineTo(pathInfo2[0][0], pathInfo2[0][1]);
        ctx.fill();
        ctx.stroke();
        //resistor
        ctx.fillStyle = '#6d2012';
        ctx.fillRect(x, y - 2.25*l, l, l/2);
        //text
        ctx.fillStyle = '#808080';
        ctx.font = String(l) + 'px monospace';
        ctx.fillText('NOT', x + l*1/4, y + 3.8*l)
        //coordinate guide
        if (extraInfo) {
            ctx.font = String(0.80*l) + 'px monospace';
            ctx.fillStyle = '#ff0000';
            ctx.fillText('('+String(x - 2.5*l)+','+String(y)+')', x - 5.5*l, y + l)
            ctx.fillText('('+String(x + 2.5*l)+','+String(y)+')', x + l, y + l)
        }
    }
}

//AND Gate in terms of circuitry
//point is array coord in centre of surrounding rectangle
//for now only 'down' direction supported
//size is radius of transistor
//onDep is name of the on dependency
//color is for border
//only connect to wires
class ANDGateFull {
    constructor(name, point, on, onDeps, direction, size, color) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDeps = onDeps;
        this.onDep1 = false;
        this.onDep2 = false;
        this.direction = direction;
        this.size = size;
        this.color = color;
    }
    updateLogic(components, clickables) {
        this.on = false;
        this.onDep1 = components[this.onDeps[0]].on;
        this.onDep2 = components[this.onDeps[1]].on;
        if (this.onDep1 && this.onDep2) {
            this.on = true;
        }
    }
    render(ctx, extraInfo) {
        const x = this.point[0];
        const y = this.point[1];
        const l = this.size;
        //border
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(x - 2*l, y - 4.5*l, 4*l, 9*l);
        //wires
        const mainWireColor = this.on ? '#375997' : '#ffff00';
        const otherWireColor = this.on ?  '#ffff00' : '#375997';
        ctx.beginPath();
        ctx.moveTo(x - l/2, y + 2*l);
        ctx.strokeStyle = '#375997';
        ctx.lineTo(x - l/2, y + 3.5*l);
        ctx.stroke();
        ctx.strokeStyle = otherWireColor;
        ctx.beginPath();
        ctx.moveTo(x - l/2, y + 2*l);
        ctx.lineTo(x + 1.5*l, y + 2*l);
        ctx.lineTo(x + 1.5*l, Math.round(y - 0.75*l));
        ctx.lineTo(x + 2.5*l, Math.round(y - 0.75*l));
        ctx.stroke();
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(x - l/2, y - 3.5*l);
        ctx.lineTo(x - l/2, y - 2.5*l);
        ctx.stroke();
        ctx.beginPath(); //line to T1
        ctx.strokeStyle = this.onDep1 ? '#ffff00' : '#375997';
        ctx.moveTo(x - l, y - 2*l);
        ctx.lineTo(x - 2.5*l, y - 2*l);
        ctx.stroke();
        ctx.beginPath() //line from T1
        ctx.moveTo(x - 0.5*l, y - 2*l);
        ctx.lineTo(x - 0.5*l, y);
        ctx.stroke();
        ctx.beginPath(); //line to T2
        ctx.strokeStyle = this.onDep2 ? '#ffff00' : '#375997';
        ctx.moveTo(x - l, y + 0.5*l);
        ctx.lineTo(x - 2.5*l, y + 0.5*l);
        ctx.stroke();
        ctx.beginPath() //line from T2
        ctx.strokeStyle = (this.onDep1 && this.onDep2) ? '#ffff00' : '#375997';
        ctx.moveTo(x - 0.5*l, y);
        ctx.lineTo(x - 0.5*l, y + 2*l);
        ctx.stroke();
        //transistor1
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - l/2, y - 2*l, l, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = this.onDep1 ? '#ffff00' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - l/2, y - 2*l-l*3/4);
        ctx.lineTo(x - l/2, y - 2*l+l*3/4);
        ctx.lineTo(x - l/2+l/4, y - 2*l+l*2/4);
        ctx.lineTo(x - l/2-l/4, y - 2*l+l*2/4);
        ctx.lineTo(x - l/2, y - 2*l+l*3/4);
        ctx.stroke();
        //transistor2
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - l/2, y + 0.5*l, l, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = (this.onDep1 && this.onDep2) ? '#ffff00' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - l/2, y + 0.5*l-l*3/4);
        ctx.lineTo(x - l/2, y + 0.5*l+l*3/4);
        ctx.lineTo(x - l/2+l/4, y + 0.5*l+l*2/4);
        ctx.lineTo(x - l/2-l/4, y + 0.5*l+l*2/4);
        ctx.lineTo(x - l/2, y + 0.5*l+l*3/4);
        ctx.stroke();
        //decorators
        //VIn
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ffff00';
        const pathInfo1 = [[x - l/2, y - 3.5*l], [x - l, y - 3.5*l -l/2], [x, y - 3.5*l -l/2]];
        ctx.moveTo(pathInfo1[0][0], pathInfo1[0][1]);
        ctx.lineTo(pathInfo1[1][0], pathInfo1[1][1]);
        ctx.lineTo(pathInfo1[2][0], pathInfo1[2][1]);
        ctx.lineTo(pathInfo1[0][0], pathInfo1[0][1]);
        ctx.fill();
        ctx.stroke();
        //VOut
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#808080';
        const pathInfo2 = [[x - l/2, y + 3.5*l + l/2], [x - l, y + 3.5*l], [x, y + 3.5*l]];
        ctx.moveTo(pathInfo2[0][0], pathInfo2[0][1]);
        ctx.lineTo(pathInfo2[1][0], pathInfo2[1][1]);
        ctx.lineTo(pathInfo2[2][0], pathInfo2[2][1]);
        ctx.lineTo(pathInfo2[0][0], pathInfo2[0][1]);
        ctx.fill();
        ctx.stroke();
        //resistor
        ctx.fillStyle = '#6d2012';
        ctx.fillRect(x - 0.75*l, y + 2.25*l, l/2, l);
        //text
        ctx.fillStyle = '#808080';
        ctx.font = String(l) + 'px monospace';
        ctx.fillText('AND', x + l*1/4, y + 4.3*l)
    }
}

//OR Gate in terms of circuitry
//point is array coord in centre of surrounding rectangle
//for now only 'down' direction supported
//size is radius of transistor
//onDep is name of the on dependency
//color is for border
//only connect to wires
class ORGateFull {
    constructor(name, point, on, onDeps, direction, size, color) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDeps = onDeps;
        this.onDep1 = false;
        this.onDep2 = false;
        this.direction = direction;
        this.size = size;
        this.color = color;
    }
    updateLogic(components, clickables) {
        this.on = false;
        this.onDep1 = components[this.onDeps[0]].on;
        this.onDep2 = components[this.onDeps[1]].on;
        if (this.onDep1 || this.onDep2) {
            this.on = true;
        }
    }
    render(ctx, extraInfo) {
        const x = this.point[0];
        const y = this.point[1];
        const l = this.size;
        //border
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(x - 2*l, y - 4.5*l, 4*l, 9*l);
        //wires
        const mainWireColor = this.on ? '#375997' : '#ffff00';
        const otherWireColor = this.on ?  '#ffff00' : '#375997';
        ctx.beginPath(); //wire through resistor
        ctx.moveTo(x - l/2, y + 2*l);
        ctx.strokeStyle = '#375997';
        ctx.lineTo(x - l/2, y + 3.5*l);
        ctx.stroke();
        ctx.strokeStyle = otherWireColor;
        ctx.beginPath(); //out wire
        ctx.moveTo(x + 1.5*l, y - 0.45*l);
        ctx.lineTo(x + 1.5*l, Math.round(y - 0.75*l));
        ctx.lineTo(x + 2.5*l, Math.round(y - 0.75*l));
        ctx.stroke();
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath(); //line from Vin
        ctx.moveTo(x - l/2, y - 3.5*l);
        ctx.lineTo(x - l/2, y - 3.3*l);
        ctx.stroke();
        ctx.beginPath(); //line from above to both T before gap
        ctx.moveTo(x + l/2, y - 2.5*l);
        ctx.lineTo(x + l/2, y - 3.3*l);
        ctx.lineTo(x - 1.5*l, y - 3.3*l);
        ctx.lineTo(x - 1.5*l, y - 2.2*l)
        ctx.stroke();
        ctx.beginPath(); //after gap
        ctx.moveTo(x - 1.5*l, y - 1.8*l)
        ctx.lineTo(x - 1.5*l, y - l);
        ctx.lineTo(x - 0.5*l, y - l);
        ctx.lineTo(x - 0.5*l, y);
        ctx.stroke();
        ctx.beginPath(); //line to T1
        ctx.strokeStyle = this.onDep1 ? '#ffff00' : '#375997';
        ctx.moveTo(x , y - 2*l);
        ctx.lineTo(x - 2.5*l, y - 2*l);
        ctx.stroke();
        ctx.beginPath() //line from T1
        ctx.moveTo(x + 0.5*l, y - 2*l);
        ctx.lineTo(x + 0.5*l, y - 0.5*l);
        ctx.lineTo(x + 1.5*l, y - 0.5*l);
        ctx.stroke();
        ctx.beginPath(); //line to T2
        ctx.strokeStyle = this.onDep2 ? '#ffff00' : '#375997';
        ctx.moveTo(x - l, y + 0.5*l);
        ctx.lineTo(x - 2.5*l, y + 0.5*l);
        ctx.stroke();
        ctx.beginPath() //line from T2
        ctx.strokeStyle = (this.onDep2) ? '#ffff00' : '#375997';
        ctx.moveTo(x - 0.5*l, y);
        ctx.lineTo(x - 0.5*l, y + 2*l);
        ctx.lineTo(x + 1.5*l, y + 2*l);
        ctx.lineTo(x + 1.5*l, y - 0.5*l);
        ctx.stroke();
        //transistor1
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + l/2, y - 2*l, l, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = this.onDep1 ? '#ffff00' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x + l/2, y - 2*l-l*3/4);
        ctx.lineTo(x + l/2, y - 2*l+l*3/4);
        ctx.lineTo(x + l/2+l/4, y - 2*l+l*2/4);
        ctx.lineTo(x + l/2-l/4, y - 2*l+l*2/4);
        ctx.lineTo(x + l/2, y - 2*l+l*3/4);
        ctx.stroke();
        //transistor2
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - l/2, y + 0.5*l, l, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = this.onDep2 ? '#ffff00' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - l/2, y + 0.5*l-l*3/4);
        ctx.lineTo(x - l/2, y + 0.5*l+l*3/4);
        ctx.lineTo(x - l/2+l/4, y + 0.5*l+l*2/4);
        ctx.lineTo(x - l/2-l/4, y + 0.5*l+l*2/4);
        ctx.lineTo(x - l/2, y + 0.5*l+l*3/4);
        ctx.stroke();
        //decorators
        //VIn
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ffff00';
        const pathInfo1 = [[x - l/2, y - 3.5*l], [x - l, y - 3.5*l -l/2], [x, y - 3.5*l -l/2]];
        ctx.moveTo(pathInfo1[0][0], pathInfo1[0][1]);
        ctx.lineTo(pathInfo1[1][0], pathInfo1[1][1]);
        ctx.lineTo(pathInfo1[2][0], pathInfo1[2][1]);
        ctx.lineTo(pathInfo1[0][0], pathInfo1[0][1]);
        ctx.fill();
        ctx.stroke();
        //VOut
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#808080';
        const pathInfo2 = [[x - l/2, y + 3.5*l + l/2], [x - l, y + 3.5*l], [x, y + 3.5*l]];
        ctx.moveTo(pathInfo2[0][0], pathInfo2[0][1]);
        ctx.lineTo(pathInfo2[1][0], pathInfo2[1][1]);
        ctx.lineTo(pathInfo2[2][0], pathInfo2[2][1]);
        ctx.lineTo(pathInfo2[0][0], pathInfo2[0][1]);
        ctx.fill();
        ctx.stroke();
        //resistor
        ctx.fillStyle = '#6d2012';
        ctx.fillRect(x - 0.75*l, y + 2.25*l, l/2, l);
        //text
        ctx.fillStyle = '#808080';
        ctx.font = String(l) + 'px monospace';
        ctx.fillText('OR', x + l*3/4, y + 4.3*l)
    }
}

//OR Gate as a symbol
//for now only 'right' direction supported
//size is radius of transistor
//onDep is name of the on dependency
//color is for fill
//only connect to wires
class ORGate {
    constructor(name, point, on, onDeps, direction, size, color) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDeps = onDeps;
        this.onDep1 = false;
        this.onDep2 = false;
        this.direction = direction;
        this.size = size;
        this.color = color;
    }
    updateLogic(components, clickables) {
        this.on = false;
        this.onDep1 = components[this.onDeps[0]].on;
        this.onDep2 = components[this.onDeps[1]].on;
        if (this.onDep1 || this.onDep2) {
            this.on = true;
        }
    }
    render(ctx, extraInfo) {
        const x = this.point[0];
        const y = this.point[1];
        const l = this.size;
        //wires
        ctx.strokeStyle = (this.onDep1 || this.onDep2) ? '#ffff00' : '#375997';
        ctx.beginPath(); //out wire
        ctx.moveTo(x + 0.5*l, y);
        ctx.lineTo(x + 1.5*l, y);
        ctx.stroke();
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath(); //in wire 1
        ctx.strokeStyle = this.onDep1 ? '#ffff00' : '#375997';
        ctx.moveTo(x - 0.5*l , Math.round(y - 0.5*l));
        ctx.lineTo(x - 1.5*l, Math.round(y - 0.5*l));
        ctx.stroke();
        ctx.beginPath(); //in wire 2
        ctx.strokeStyle = this.onDep2 ? '#ffff00' : '#375997';
        ctx.moveTo(x - 0.5*l, y + Math.round(0.5*l));
        ctx.lineTo(x - 1.5*l, Math.round(y + 0.5*l));
        ctx.stroke();
        ctx.beginPath(); //shape
        ctx.fillStyle = this.color;
        ctx.arc(x - 0.5*l, y + l, 2*l, Math.PI*3/2, 2 * Math.PI - Math.PI/6);
        ctx.arc(x - 0.5*l, y - l, 2*l, Math.PI/6, Math.PI/2);
        ctx.arc(x - 2*l - 0.5*l, y, 2*l, Math.PI/6, -Math.PI/6, true);
        ctx.fill();
    }
}

//NOT Gate as a symbol
//for now only 'down' direction supported
//size is radius of transistor
//onDep is name of the on dependency
//color is for fill
//only connect to wires
class NOTGate {
    constructor(name, point, on, onDep, direction, size, color) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDep = onDep;
        this.direction = direction;
        this.size = size;
        this.color = color;
    }
    updateLogic(components, clickables) {
        const onDepOn = components[this.onDep].on;
        this.on = false;
        if (!onDepOn) {
            this.on = true;
        }
    }
    render(ctx, extraInfo) {
        const x = this.point[0];
        const y = this.point[1];
        const l = this.size;
        const width = l*(3**0.5);
        //wires
        ctx.strokeStyle = this.on ? '#ffff00' : '#375997';
        ctx.beginPath(); //out wire
        ctx.moveTo(x + 0.5*l, y);
        ctx.lineTo(x + 1.5*l, y);
        ctx.stroke();
        ctx.beginPath(); //in wire
        ctx.strokeStyle = this.on ? '#375997' : '#ffff00';
        ctx.moveTo(x - 0.5*l , y);
        ctx.lineTo(x - 1.5*l, y);
        ctx.stroke();
        ctx.beginPath(); //shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(x - l, y - l);
        ctx.lineTo(x - l, y + l);
        ctx.lineTo(x - l + width, y);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - l + width + 0.18*l, y, l/4, 0, 2 * Math.PI);
        ctx.fill();
    }
}

//AND Gate as a symbol
//for now only 'right' direction supported
//size is radius of transistor
//onDeps is name of the on dependency
//color is for fill
//only connect to wires
class ANDGate {
    constructor(name, point, on, onDeps, direction, size, color) {
        this.name = name;
        this.point = point;
        this.on = on;
        this.onDeps = onDeps;
        this.onDep1 = false;
        this.onDep2 = false;
        this.direction = direction;
        this.size = size;
        this.color = color;
    }
    updateLogic(components, clickables) {
        this.on = false;
        this.onDep1 = components[this.onDeps[0]].on;
        this.onDep2 = components[this.onDeps[1]].on;
        if (this.onDep1 && this.onDep2) {
            this.on = true;
        }
    }
    render(ctx, extraInfo) {
        const x = this.point[0];
        const y = this.point[1];
        const l = this.size;
        const s = 0.9*l;
        //wires
        ctx.strokeStyle = (this.onDep1 && this.onDep2) ? '#ffff00' : '#375997';
        ctx.beginPath(); //out wire
        ctx.moveTo(x + 0.5*l, y);
        ctx.lineTo(x + 1.5*l, y);
        ctx.stroke();
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath(); //in wire 1
        ctx.strokeStyle = this.onDep1 ? '#ffff00' : '#375997';
        ctx.moveTo(x - 0.5*l , Math.round(y - 0.5*l));
        ctx.lineTo(x - 1.5*l, Math.round(y - 0.5*l));
        ctx.stroke();
        ctx.beginPath(); //in wire 2
        ctx.strokeStyle = this.onDep2 ? '#ffff00' : '#375997';
        ctx.moveTo(x - 0.5*l, y + Math.round(0.5*l));
        ctx.lineTo(x - 1.5*l, Math.round(y + 0.5*l));
        ctx.stroke();
        ctx.beginPath(); //shape
        ctx.fillStyle = this.color;
        ctx.fillRect(x - s, y - s, 1.5*s, 2*s);
        ctx.arc(x + 0.5*s, y, s, 0, 2 * Math.PI);
        ctx.fill();
    }
}



class BasicTimer {
    constructor(name, circ, method, point, freq, on, dep, size) {
        this.name = name;
        this.circ = circ;
        this.method = method;
        this.point = point;
        this.freq = freq;
        this.on = on;
        this.dep = dep;
        this.size = size;
        this.timerStore = null;
    }
    onOff() {
        this.on = this.on ? false : true;
    }
    forInterval() {
        this.on = true;
        this.circ.updateAllLogic();
        //console.log(this.on);
        //console.log(this);
    }
    timerSwitch() {
        if (this.timerStore) {
            clearInterval(this.timerStore);
            this.timerStore = null;
            this.on = false;
        }
        else {
            let timerSelf = this;
            let timerCirc = this.circ;
            const timerName = this.name;
            this.timerStore = setInterval((timerSelf, timerCirc, timerName) => {
                timerSelf.on = timerSelf.on ? false : true;
                //timerCirc.components[timerName].on = true;
                timerCirc.update();
            }, 1000/this.freq, timerSelf, timerCirc, timerName);
        }
    }
    updateLogic(components, clickables) {
        if (components[this.dep].on && !this.timerStore) {
            this.timerSwitch();
        }
        else if (!components[this.dep].on && this.timerStore) {
            this.timerSwitch();
        }
    }
    render(ctx, extraInfo) {
        const width = this.size/2;
        const height = this.size;
        const shapeStart = [this.point[0]-width/2, this.point[1]-height/2];
        ctx.fillStyle = '#111111';
        ctx.fillRect(shapeStart[0], shapeStart[1], width, height);
    }
}





//DECORATORS

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
            'right': [this.point, [this.point[0]-this.size, this.point[1]-this.size], [this.point[0]-this.size, this.point[1]+this.size]],
            'left': [this.point, [this.point[0]+this.size, this.point[1]-this.size], [this.point[0]+this.size, this.point[1]+this.size]]
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
    constructor(point, width, height, color) {
        this.point = point;
        this.height = height;
        this.width = width;
        this.color = color;
    }
    render(ctx, extraInfo) {
        const shapeStart = [this.point[0]-this.width/2, this.point[1]-this.height/2];
        ctx.fillStyle = this.color;
        ctx.fillRect(shapeStart[0], shapeStart[1], this.width, this.height);
    }
}

//used to place a small gap on a wire for wires that cross over. Use just after wire that needs gaps
//point is an array coord
class WireGap {
    constructor(point) {
        this.point = point;
        this.size = 10;
    }
    render(ctx) {
        ctx.fillStyle = '#0f2d06';
        ctx.fillRect(this.point[0]-this.size/2, this.point[1]-this.size/2, this.size, this.size);
    }
}


//CLICKABLES

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
        ctx.fillStyle = (this.on ? '#262626' : '#666666');
        ctx.strokeStyle = '#808080';
        ctx.fillRect(this.shapeStart[0], this.shapeStart[1], this.size, this.size);
        ctx.strokeRect(this.shapeStart[0], this.shapeStart[1], this.size, this.size);
        if (this.digit != 'off') {
            ctx.font = String(this.size*3/4) + "px monospace";
            ctx.fillStyle = '#ffffff'
            const text = this.on ? '1' : '0';
            if (this.digit == 'up') {
                ctx.fillText(text, this.point[0] - this.size/4, this.point[1] - this.size);
            }
            else if (this.digit == 'down') {
                ctx.fillText(text, this.point[0] - this.size/4, this.point[1] + this.size*5/4);
            }
            else if (this.digit == 'left') {
                ctx.fillText(text, this.point[0] - this.size*5/4, this.point[1] + this.size/4);
            }
            else if (this.digit == 'right') {
                ctx.fillText(text, this.point[0] + this.size*3/4, this.point[1] + this.size/4);
            }
        }
    }
}



//Experiments
class TestParent {
    constructor() {
        this.childHolder = {};
    }
    testMethod() {
        console.log("test successful");
    }
    addChild1(name) {
        this.childHolder[name] = new TestChild1(name, this);
    }
    addChild2(name) {
        this.childHolder[name] = new TestChild2(name, this.testMethod);
    }
}

class TestChild1 {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    parentMethod() {
        this.parent.testMethod();
    }
}

class TestChild2 {
    constructor(name, method) {
        this.name = name;
        this.method = method;
    }
    parentMethod() {
        this.method();
    }
}

let parent = new TestParent();
parent.addChild1('child1');
parent.addChild2('child2');
