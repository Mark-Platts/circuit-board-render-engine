
function testCircuitLogic() {
    circ1.extraInfo = true;
    circ1.addWire('testWire', [[20,20],[80,20],[80,100]], false);
    circ1.addWireGaps([[40, 20], [60,20]]);
    circ1.addVInOut([20,20], 'right', true);
    circ1.addResistor([100,100], 20, 40);
    circ1.addSwitch('testSwitch', [200,200], true, 'up');
    circ1.addWire('testOnOffWire', [[200,200],[240,200]], false, ['testSwitch']);
    circ1.addSwitch('testSwitch2', [250,240], false);
    circ1.addTransistor('testTrans', [300,300], false, [], 'left');
    circ1.addNOTGateFull('testORFull', [400, 300], false, 'testOnOffWire', 'down');
    circ1.update();
}

function testCircuitLogic2() {
    circ2.addSwitch('S1', [20,20], false);
    circ2.addSwitch('S2', [20,180], false);
    circ2.addWire('W1', [[20,20],[100,20],[100,100]], false, ['S1']);
    circ2.addWire('W2', [[20,180],[100,180],[100,100]], false, ['S2']);
    circ2.addWire('W3', [[100,100],[180,100]], false, ['W1','W2']);
    circ2.addCircleBulb('B1', [180,100], false, ['W3']);
    circ2.addResistor([100, 80], 8, 16);
    circ2.addResistor([100, 120], 8, 16);
    circ2.update();
}

function testCircuitLogic3() {
    circ3.addSwitch('S1', [20,20], false);
    circ3.addSwitch('S2', [20,180], false);
    circ3.addWire('W1', [[20,20],[100,20],[100,100]], false, ['S1']);
    circ3.addWire('W2', [[20,180],[100,180],[100,100]], false, ['S2']);
    circ3.addWire('W3', [[100,100],[180,100]], false, ['T1']);
    circ3.addTransistor('T1', [100,100], false, ['W1','W2'], 'right');
    circ3.addCircleBulb('B1', [180,100], false, ['W3']);
    circ3.orderOverride.push('T1');
    circ3.update();
}

function testCircuitLogic4() {
    circ4.addSwitch('S1', [20,100], false, 'up');
    circ4.addWire('W1', [[20,100],[100,100]], false, ['S1']);
    circ4.addNOTGateFull('NOT1', [100, 100], false, 'W1');
    circ4.addWire('W3', [[130,100],[180,100]], false, ['NOT1']);
    circ4.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    circ4.update();
}

function testCircuitLogic5() {
    circ5.addSwitch('S1', [20,20], false, 'down');
    circ5.addSwitch('S2', [20,180], false, 'up');
    circ5.addWire('W1', [[20,20],[50,20],[50,82], [65,82]], false, ['S1']);
    circ5.addWire('W2', [[20,180],[50,180],[50,117],[65,117]], false, ['S2']);
    circ5.addWire('W3', [[130,100],[180,100]], false, ['AND1']);
    circ5.addANDGateFull('AND1', [100, 110], false, ['W1','W2']);
    circ5.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    circ5.update();
}

function testCircuitLogic6() {
    circ6.addSwitch('S1', [20,20], false, 'down');
    circ6.addSwitch('S2', [20,180], false, 'up');
    circ6.addWire('W1', [[20,20],[50,20],[50,82], [65,82]], false, ['S1']);
    circ6.addWire('W2', [[20,180],[50,180],[50,117],[65,117]], false, ['S2']);
    circ6.addWire('W3', [[130,100],[180,100]], false, ['OR1']);
    circ6.addORGateFull('OR1', [100, 110], false, ['W1','W2']);
    circ6.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    circ6.update();
}

function testCircuitLogic7() {
    circ7.addSwitch('S1', [20,20], false, 'down');
    circ7.addSwitch('S2', [20,180], false, 'up');
    circ7.addWire('W1', [[20,20],[50,20],[50,91], [80,91]], false, ['S1']);
    circ7.addWire('W2', [[20,180],[50,180],[50,109],[80,109]], false, ['S2']);
    circ7.addWire('W3', [[120,100],[180,100]], false, ['OR1']);
    circ7.addORGate('OR1', [100, 100], false, ['W1','W2']);
    circ7.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    circ7.update();
}

function testCircuitLogic8() {
    circ8.addSwitch('S1', [20,100], false, 'down');
    circ8.addWire('W1', [[20,100],[80,100]], false, ['S1']);
    circ8.addWire('W3', [[120,100],[180,100]], false, ['NOT1']);
    circ8.addNOTGate('NOT1', [100, 100], false, 'W1');
    circ8.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    circ8.update();
}

function testCircuitLogic9() {
    circ9.addSwitch('S1', [20,20], false, 'down');
    circ9.addSwitch('S2', [20,180], false, 'up');
    circ9.addWire('W1', [[20,20],[50,20],[50,91], [80,91]], false, ['S1']);
    circ9.addWire('W2', [[20,180],[50,180],[50,109],[80,109]], false, ['S2']);
    circ9.addWire('W3', [[120,100],[180,100]], false, ['AND1']);
    circ9.addANDGate('AND1', [100, 100], false, ['W1','W2']);
    circ9.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    circ9.update();
}

function testCircuitLogic10() {
    //switches
    circ10.addSwitch('S1', [20,40], false, 'up');
    circ10.addSwitch('S2', [20,90], false, 'up');
    //wire and its splits from switch 1
    circ10.addWire('W1', [[20,40],[130,40]], false, ['S1']);
    circ10.addWire('W1S1', [[60,40],[60,247],[200,247]], false, ['W1']);
    circ10.addWire('W1S2', [[100,40],[100,160],[200,160]], false, ['W1']);
    //wire and its splits from switch 1
    circ10.addWire('W2', [[20, 90],[200,90]], false, ['S2']);
    circ10.addWire('W2S1', [[50,90],[50,265],[200,265]], false, ['W2']);
    circ10.addWire('W2S2', [[90,90],[90,190],[130,190]], false, ['W2']);
    //NOT gates
    circ10.addNOTGate('NOT1', [140, 40], false, 'W1');
    circ10.addNOTGate('NOT2', [140, 190], false, 'W2');
    //wires from NOT Gates
    circ10.addWire('W3', [[164,40],[170,40],[170,72],[185,72]], false, ['NOT1']);
    circ10.addWire('W4', [[164,190],[170,190],[170,178],[185,178]], false, ['NOT2']);
    //AND Gates
    circ10.addANDGate('AND1', [210, 81], false, ['NOT1','W2']);
    circ10.addANDGate('AND2', [210, 169], false, ['W1','NOT2']);
    circ10.addANDGate('AND3', [210, 256], false, ['W1','W2']);
    //wires from AND Gates
    circ10.addWire('W5', [[235, 81],[245,81],[245,116],[255,116]], false, ['AND1']);
    circ10.addWire('W6', [[235, 169],[245,169],[245,134],[255,134]], false, ['AND2']);
    circ10.addWire('W7', [[235, 256],[360,256]], false, ['AND3']);
    //OR gate plus out wire
    circ10.addORGate('OR1', [280, 125], false, ['W5', 'W6']);
    circ10.addWire('W8', [[305, 125],[360, 125]], false, ['OR1']);
    //bulbs
    circ10.addCircleBulb('B1', [360, 125], false, ['W8'], 'up');
    circ10.addCircleBulb('B2', [360, 256], false, ['W7'], 'up');
    circ10.update();
}