
let wireSplitCirc = new Circuit("wire-split", '200px', '200px');
wireSplitCirc.addSwitch('S1', [20,20], false);
wireSplitCirc.addSwitch('S2', [20,180], false);
wireSplitCirc.addWire('W1', [[20,20],[100,20],[100,100]], false, ['S1']);
wireSplitCirc.addWire('W2', [[20,180],[100,180],[100,100]], false, ['S2']);
wireSplitCirc.addWire('W3', [[100,100],[180,100]], false, ['W1','W2']);
wireSplitCirc.addCircleBulb('B1', [180,100], false, ['W3']);
wireSplitCirc.addResistor([100, 80], 8, 16);
wireSplitCirc.addResistor([100, 120], 8, 16);
wireSplitCirc.update();







