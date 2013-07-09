describe("Appl", function() {
  var appl;

  beforeEach(function() {
    appl = new Appl();
  });

  it("init", function() {
    expect(appl.width()).toEqual(0);
    expect(appl.height()).toEqual(0);
    expect(appl.selected_layer()).toEqual("background");
  });
  
  it("it should add new sprite sheet", function() {
  	appl.add_sprite_sheet("foo.png");
  	expect(appl.selected_sheet().sheet()).toEqual("foo.png");
  	expect(appl.selected_sheet().grid_width()).toEqual(-1);
  });
  
  it("it should add a sprite sheet item", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,17,17]);
  	appl.add_spite_sheet_item();
  });
  
  it("it should add a sprite list item", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,17,17]);
  	appl.add_spite_sheet_item();
  	appl.do_action(5,5);
  	expect(appl.sprite_list().length).toEqual(1);
  });
  
  it("it should add a layer", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,17,17]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	expect(appl.sprite_list()[0].layer()).toEqual("water");
  	expect(appl.layers()).toEqual(["background","water"]);
  });
  
  it("should delete sprite list item", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,17,17]);
  	appl.add_spite_sheet_item();
  	appl.do_action(5,5);
  	appl.remove_sprite_list_item(6,8);
  	expect(appl.sprite_list().length).toEqual(0);
  });
  
  it("should delete sprite list item on a new layer", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,17,17]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	appl.remove_sprite_list_item(6,8);
  	expect(appl.sprite_list().length).toEqual(0);
  });
  
  it("should not delete sprite list item on the background layer", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,17,17]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	appl.selected_layer("background");
  	appl.remove_sprite_list_item(6,8);
  	expect(appl.sprite_list().length).toEqual(1);
  });
});