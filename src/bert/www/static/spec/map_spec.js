describe("Map", function() {
  var map;
  
  beforeEach(function() {
	  map = new Map();
  });

  it("it should have a width of 0", function() {    
	expect(map.width).toEqual(0);
  });
  it("it should have a height of 0", function() {
    expect(map.height).toEqual(0);
  });
    
  describe("Map, sized", function() {
      map2 = new Map(80,100);
      
      it("it should have a width of 80", function() {    
	    expect(map2.width).toEqual(80);
      });
      it("it should have a height of 100", function() {
        expect(map2.height).toEqual(100);
      });
  });
  
  describe("Map Unit", function() {
	  var unit;
  
	  beforeEach(function() {
		unit = new Unit();
	  });

	  it("it should add a unit", function() { 
		map.add_unit(unit);   
		expect(map.units.length).toEqual(1);
	  });


	  it("it should remove a unit", function() { 
		map.add_unit(unit);
		map.remove_unit();
		expect(map.units.length).toEqual(0);
	  });
      
      it("it should collide", function() { 
		map.add_unit(unit);
        try {
          map.add_unit(new Unit());
        }
        catch(err) {
            expect(err).toEqual("unit collision");
        }
		expect(map.units.length).toEqual(1);
	  });

  });

  
  describe("Map Unit Selection", function() {
	  var unit;
  
	  beforeEach(function() {
		unit = new Unit();
		map.add_unit(unit);   
	  });

	  it("it should select a unit", function() {
		map.select_unit(unit);
		expect(map.selected_units.length).toEqual(1);
	  });


	  it("it should deselect a unit", function() { 
		map.select_unit(unit);
		map.deselect_unit(unit);
		expect(map.selected_units.length).toEqual(0);
	  });


	  it("it should clear selection", function() { 
		map.select_unit(unit);
		map.clear_selection();
		expect(map.selected_units.length).toEqual(0);
	  });

  });

  describe("Map Commit", function() {
	  var unit;
      var unit2 = new Unit(1,1);
      var unit3 = new Unit(2,2);
  
	  beforeEach(function() {
		unit = new Unit();
		map.add_unit(unit);
        map.add_unit(unit2);
        map.add_unit(unit3);
	  });

	  it("it should commit", function() {
		unit.move_to(10,10);
        map.commit();
        expect(unit.loc()).toEqual([10,10]);
	  });
      
      it("it should move neither", function() {
        unit.move_to(10,10);
        unit2.move_to(10,10);
        map.commit();
        expect(unit.loc()).toEqual([0,0]);
        expect(unit2.loc()).toEqual([1,1]);
	  });
      
      it("it should move none", function() {
        unit.move_to(10,10);
        unit2.move_to(10,10);
        unit3.move_to(10,10);
        map.commit();
        expect(unit.loc()).toEqual([0,0]);
        expect(unit2.loc()).toEqual([1,1]);
        expect(unit3.loc()).toEqual([2,2]);
	  });
  });
    
    

  describe("Map unit movements", function() {
	  var unit;
      var unit2 = new Unit(1,1);
      var unit3 = new Unit(2,2);
  
	  beforeEach(function() {
		unit = new Unit();
		map.add_unit(unit);
        map.add_unit(unit2);
        map.add_unit(unit3);
	  });

	  it("it should commit but not move", function() {
		unit.move_to(1,1);
        map.commit();
        expect(unit.loc()).toEqual([0,0]);
	  });
      
      it("it should not move unit", function() {
        unit.move_to(1,1);
        unit2.move_to(2,2);
        map.commit();
        expect(unit.loc()).toEqual([0,0]);
        expect(unit2.loc()).toEqual([1,1]);
        expect(unit3.loc()).toEqual([2,2]);
	  });
  });
    
});


