
describe("Solid", function() {
	var unit;
    var solid;

	beforeEach(function() {
		unit = new Unit();
        solid = new Solid(10,10);
        map = new Map();
        map.add_unit(unit);
        map.add_unit(solid);
	});

	it("it should commit", function() {
		unit.move_to(10,10);
        map.commit();
		expect(unit.loc()).toEqual([0,0]);
	});

});