
function testCircuitLogic() {
    circ1.addWire('testWire', [[20,20],[80,20],[80,100]], false);
    circ1.addWireGaps([[40, 20], [60,20]]);
    circ1.addVInOut([20,20], 'right', true);
    circ1.addResistor([100,100], 20, 40);
    circ1.addSwitch('testSwitch', [200,200], true, 'up');
    circ1.addWire('testOnOffWire', [[200,200],[240,200]], false, ['testSwitch']);
    circ1.addSwitch('testSwitch2', [250,240], false);
    circ1.addTransistor('testTrans', [300,300], false, [], 'left');
    circ1.addORGateFull('testORFull', [400, 300], false, 'testOnOffWire', 'down');
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
    circ4.addORGateFull('OR1', [100, 100], false, 'W1');
    circ4.addWire('W3', [[130,100],[180,100]], false, ['OR1']);
    circ4.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    circ4.update();
}