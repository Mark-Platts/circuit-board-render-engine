
function testCircuitLogic() {
    circ1.addWire('testWire', [[20,20],[80,20],[80,100]], false);
    circ1.addVInOut([20,20], 'left', true);
    circ1.addResistor([100,100], 20, 40);
    circ1.addSwitch('testSwitch', [200,200], true);
    circ1.addWire('testOnOffWire', [[200,200],[240,200]], false, ['testSwitch']);
    circ1.addSwitch('testSwitch2', [250,200], false);
    circ1.renderComponents();
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
    circ2.renderComponents();
}