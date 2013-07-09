
describe("Unit", function() {
	var unit;

	beforeEach(function() {
		unit = new Unit();
	});

	it("it should have a loc of 0,0", function() {
		expect(unit.loc()).toEqual([0,0]);
	});

    it("it should have a loc of 10,0", function() {
        unit.x = 10;
		expect(unit.loc()).toEqual([10,0]);
	});
    
	it("it should move", function() {
		unit.move_to(10,10);
		expect(unit.loc()).toEqual([0,0]);
	});

	it("it should commit", function() {
		unit.move_to(10,9);
		unit._commit_();
		expect(unit.loc()).toEqual([10,9]);
	});

});