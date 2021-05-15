
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
    renderComponents() {
        for (let i in this.components) {
            this.components[i].render(this.ctx, this.extraInfo);
        }
    }
}


//creates a wire object. name is a preferrably unique string, points is an array of arrays, denoting where each point of the wire is,
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
        ctx.strokeStyle = (this.on ? '#ffff00' : '#808080');
        ctx.lineWidth = 2;
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


class VInOut {
    constructure() {

    }
}