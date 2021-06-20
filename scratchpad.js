

class TestObject {
    constructor(on) {
        this.on = on;
        this.timerStore = null;
    }
    forInterval() {
        this.on = true;
        console.log(this.on);
        console.log(this);
    }
    timerSwitch() {
        if (this.timerStore) {
            clearInterval(this.timerStore);
            this.timerStore = null;
            //this.on = false;
        }
        else {
            const thisObject = this;
            const timerFunction = this.forInterval;
            const boundTimerFunction = timerFunction.bind(this);
            this.timerStore = setInterval((thisObject) => {
                thisObject.on = true;
                console.log(thisObject.on);
                console.log(thisObject);
            }, 1000, thisObject);
        }
    }
}

let testObject = new TestObject(false);