
function testCircuitLogic() {
    circ1.addWire('testWire', [[20,20],[80,20],[80,100]], false);
    circ1.addVInOut([20,20], 'left', true);
    circ1.addResistor([100,100], 20, 40);
    circ1.addSwitch('testSwitch', [200,200], true);
    circ1.addSwitch('testSwitch2', [250,200], false);
    circ1.renderComponents();
}