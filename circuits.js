

function wireSplitCircLogic() {
    wireSplitCirc.addSwitch('S1', [20,20], false);
    wireSplitCirc.addSwitch('S2', [20,180], false);
    wireSplitCirc.addWire('W1', [[20,20],[100,20],[100,100]], false, ['S1']);
    wireSplitCirc.addWire('W2', [[20,180],[100,180],[100,100]], false, ['S2']);
    wireSplitCirc.addWire('W3', [[100,100],[180,100]], false, ['W1','W2']);
    wireSplitCirc.addCircleBulb('B1', [180,100], false, ['W3']);
    wireSplitCirc.addResistor([100, 80], 8, 16);
    wireSplitCirc.addResistor([100, 120], 8, 16);
    wireSplitCirc.update();
}

function transistorCircLogic() {
    transistorCirc.addSwitch('S1', [20,20], false);
    transistorCirc.addSwitch('S2', [20,180], false);
    transistorCirc.addWire('W1', [[20,20],[100,20],[100,100]], false, ['S1']);
    transistorCirc.addWire('W2', [[20,180],[100,180],[100,100]], false, ['S2']);
    transistorCirc.addWire('W3', [[100,100],[180,100]], false, ['T1']);
    transistorCirc.addTransistor('T1', [100,100], false, ['W1','W2'], 'right');
    transistorCirc.addCircleBulb('B1', [180,100], false, ['W3']);
    transistorCirc.orderOverride.push('T1');
    transistorCirc.update();
}

function NOTGateFullCircLogic() {
    NOTGateFullCirc.addSwitch('S1', [20,100], false, 'up');
    NOTGateFullCirc.addWire('W1', [[20,100],[100,100]], false, ['S1']);
    NOTGateFullCirc.addNOTGateFull('NOT1', [100, 100], false, 'W1');
    NOTGateFullCirc.addWire('W3', [[130,100],[180,100]], false, ['NOT1']);
    NOTGateFullCirc.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    NOTGateFullCirc.update();
}

function ANDGateFullCircLogic() {
    ANDGateFullCirc.addSwitch('S1', [20,20], false, 'down');
    ANDGateFullCirc.addSwitch('S2', [20,180], false, 'up');
    ANDGateFullCirc.addWire('W1', [[20,20],[50,20],[50,82], [65,82]], false, ['S1']);
    ANDGateFullCirc.addWire('W2', [[20,180],[50,180],[50,117],[65,117]], false, ['S2']);
    ANDGateFullCirc.addWire('W3', [[130,100],[180,100]], false, ['AND1']);
    ANDGateFullCirc.addANDGateFull('AND1', [100, 110], false, ['W1','W2']);
    ANDGateFullCirc.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    ANDGateFullCirc.update();
}

function ORGateFullCircLogic() {
    ORGateFullCirc.addSwitch('S1', [20,20], false, 'down');
    ORGateFullCirc.addSwitch('S2', [20,180], false, 'up');
    ORGateFullCirc.addWire('W1', [[20,20],[50,20],[50,82], [65,82]], false, ['S1']);
    ORGateFullCirc.addWire('W2', [[20,180],[50,180],[50,117],[65,117]], false, ['S2']);
    ORGateFullCirc.addWire('W3', [[130,100],[180,100]], false, ['OR1']);
    ORGateFullCirc.addORGateFull('OR1', [100, 110], false, ['W1','W2']);
    ORGateFullCirc.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    ORGateFullCirc.update();
}

function ORGateSymCircLogic() {
    ORGateSymCirc.addSwitch('S1', [20,20], false, 'down');
    ORGateSymCirc.addSwitch('S2', [20,180], false, 'up');
    ORGateSymCirc.addWire('W1', [[20,20],[50,20],[50,91], [80,91]], false, ['S1']);
    ORGateSymCirc.addWire('W2', [[20,180],[50,180],[50,109],[80,109]], false, ['S2']);
    ORGateSymCirc.addWire('W3', [[120,100],[180,100]], false, ['OR1']);
    ORGateSymCirc.addORGate('OR1', [100, 100], false, ['W1','W2']);
    ORGateSymCirc.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    ORGateSymCirc.update();
}

function NOTGateSymCircLogic() {
    NOTGateSymCirc.addSwitch('S1', [20,100], false, 'down');
    NOTGateSymCirc.addWire('W1', [[20,100],[80,100]], false, ['S1']);
    NOTGateSymCirc.addWire('W3', [[120,100],[180,100]], false, ['NOT1']);
    NOTGateSymCirc.addNOTGate('NOT1', [100, 100], false, 'W1');
    NOTGateSymCirc.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    NOTGateSymCirc.update();
}

function ANDGateSymCircLogic() {
    ANDGateSymCirc.addSwitch('S1', [20,20], false, 'down');
    ANDGateSymCirc.addSwitch('S2', [20,180], false, 'up');
    ANDGateSymCirc.addWire('W1', [[20,20],[50,20],[50,91], [80,91]], false, ['S1']);
    ANDGateSymCirc.addWire('W2', [[20,180],[50,180],[50,109],[80,109]], false, ['S2']);
    ANDGateSymCirc.addWire('W3', [[120,100],[180,100]], false, ['AND1']);
    ANDGateSymCirc.addANDGate('AND1', [100, 100], false, ['W1','W2']);
    ANDGateSymCirc.addCircleBulb('B1', [180,100], false, ['W3'], 'up');
    ANDGateSymCirc.update();
}

function halfAdderCircLogic() {
    //switches
    halfAdderCirc.addSwitch('S1', [20,40], false, 'up');
    halfAdderCirc.addSwitch('S2', [20,90], false, 'up');
    //wire and its splits from switch 1
    halfAdderCirc.addWire('W1', [[20,40],[130,40]], false, ['S1']);
    halfAdderCirc.addWire('W1S1', [[60,40],[60,247],[200,247]], false, ['W1']);
    halfAdderCirc.addWire('W1S2', [[100,40],[100,160],[200,160]], false, ['W1']);
    //wire and its splits from switch 1
    halfAdderCirc.addWire('W2', [[20, 90],[200,90]], false, ['S2']);
    halfAdderCirc.addWire('W2S1', [[50,90],[50,265],[200,265]], false, ['W2']);
    halfAdderCirc.addWire('W2S2', [[90,90],[90,190],[130,190]], false, ['W2']);
    //NOT gates
    halfAdderCirc.addNOTGate('NOT1', [140, 40], false, 'W1');
    halfAdderCirc.addNOTGate('NOT2', [140, 190], false, 'W2');
    //wires from NOT Gates
    halfAdderCirc.addWire('W3', [[164,40],[170,40],[170,72],[185,72]], false, ['NOT1']);
    halfAdderCirc.addWire('W4', [[164,190],[170,190],[170,178],[185,178]], false, ['NOT2']);
    //AND Gates
    halfAdderCirc.addANDGate('AND1', [210, 81], false, ['NOT1','W2']);
    halfAdderCirc.addANDGate('AND2', [210, 169], false, ['W1','NOT2']);
    halfAdderCirc.addANDGate('AND3', [210, 256], false, ['W1','W2']);
    //wires from AND Gates
    halfAdderCirc.addWire('W5', [[235, 81],[245,81],[245,116],[255,116]], false, ['AND1']);
    halfAdderCirc.addWire('W6', [[235, 169],[245,169],[245,134],[255,134]], false, ['AND2']);
    halfAdderCirc.addWire('W7', [[235, 256],[360,256]], false, ['AND3']);
    //OR gate plus out wire
    halfAdderCirc.addORGate('OR1', [280, 125], false, ['W5', 'W6']);
    halfAdderCirc.addWire('W8', [[305, 125],[360, 125]], false, ['OR1']);
    //bulbs
    halfAdderCirc.addCircleBulb('B1', [360, 125], false, ['W8'], 'up');
    halfAdderCirc.addCircleBulb('B2', [360, 256], false, ['W7'], 'up');
    halfAdderCirc.update();
}


function SRLatchLogic() {
    //switches
    SRLatch.addSwitch('S1', [20,40], false, 'up');
    SRLatch.addWire('W1', [[20,40],[115,40]], false, ['S1']);
    SRLatch.addSwitch('S2', [20,199], false, 'up');
    SRLatch.addWire('W2', [[20, 199],[115,199]], false, ['S2']);
    //OR gate plus out wire
    SRLatch.addORGate('OR1', [140, 49], false, ['W1', 'WS2']);
    SRLatch.addWire('OR1OW', [[165,49],[200,49]], false, ['OR1']);
    SRLatch.addORGate('OR2', [140, 190], false, ['WS1', 'W2']);
    SRLatch.addWire('OR2OW', [[165,190],[200,190]], false, ['OR2']);
    //NOT gates
    SRLatch.addNOTGate('NOT1', [210, 49], false, 'OR1OW');
    SRLatch.addWire('NOT1OW', [[235,49],[360,49]], false, ['NOT1']);
    SRLatch.addNOTGate('NOT2', [210, 190], false, 'OR2OW');
    SRLatch.addWire('NOT2OW', [[235,190],[360,190]], false, ['NOT2']);
    //cross wires
    SRLatch.addWire('WS1', [[250,49],[250,69],[100,170],[100,181],[120,181]], false, ['NOT1OW']);
    SRLatch.addWire('WS2', [[250,190],[250,170],[100,69],[100,58],[120,58]], false, ['NOT2OW']);
    //bulbs
    SRLatch.addCircleBulb('B1', [360, 49], false, ['NOT1OW'], 'up');
    SRLatch.addCircleBulb('B2', [360, 190], false, ['NOT2OW'], 'up');
    SRLatch.update();
}

function SRLatchFullLogic() {
    //switches
    SRLatchFull.addSwitch('S1', [20,41], false, 'up');
    SRLatchFull.addWire('W1', [[20,41],[165,41]], false, ['S1']);
    SRLatchFull.addSwitch('S2', [20,317], false, 'up');
    SRLatchFull.addWire('W2', [[20, 317],[165,317]], false, ['S2']);
    //OR gate plus out wire
    SRLatchFull.addORGateFull('OR1', [200, 69], false, ['W1', 'WS2']);
    SRLatchFull.addWire('OR1OW', [[235,58],[235,70]], false, ['OR1']);
    SRLatchFull.addORGateFull('OR2', [200, 310], false, ['WS1', 'W2']);
    SRLatchFull.addWire('OR2OW', [[235,299],[235,311]], false, ['OR2']);
    //NOT gates
    SRLatchFull.addNOTGateFull('NOT1', [270, 69], false, 'OR1OW');
    SRLatchFull.addWire('NOT1OW', [[300,69],[500,69]], false, ['NOT1']);
    SRLatchFull.addNOTGateFull('NOT2', [270, 310], false, 'OR2OW');
    SRLatchFull.addWire('NOT2OW', [[300,310],[500,310]], false, ['NOT2']);
    //cross wires
    SRLatchFull.addWire('WS1', [[350,69],[350,140],[120,240],[120,282],[165,282]], false, ['NOT1OW']);
    SRLatchFull.addWire('WS2', [[350,310],[350,240],[120,140],[120,76],[165,76]], false, ['NOT2OW']);
    //bulbs
    SRLatchFull.addCircleBulb('B1', [490, 69], false, ['NOT1OW'], 'up');
    SRLatchFull.addCircleBulb('B2', [490, 310], false, ['NOT2OW'], 'up');
    SRLatchFull.update();
}

function basicTimerLogic() {
    //switches
    basicTimer.addSwitch('S1', [20,100], false, 'up');
    basicTimer.addWire('W1', [[20,100],[90,100]], false, ['S1']);
    //basic timer
    basicTimer.addBasicTimer('BT', [100,100], 4, false, 'W1');
    //wire and bulb
    basicTimer.addWire('W2', [[110,100],[180,100]], false, ['BT']);
    basicTimer.addCircleBulb('B1', [180, 100], false, ['W2'], 'up');
    basicTimer.update();
}