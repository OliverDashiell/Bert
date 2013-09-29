describe("Appl", function() {
  var appl;
  var grid_size = 16;

  beforeEach(function() {
      appl = new Appl();
      appl.edit_layers = ko.observableArray();
  });

  it("init", function() {
    expect(appl.width()).toEqual(640);
    expect(appl.height()).toEqual(480);
    expect(appl.selected_layer()).toEqual("background");
  });
  
  it("it should add new sprite sheet", function() {
  	appl.add_sprite_sheet("foo.png");
  	expect(appl.selected_sheet().sheet()).toEqual("foo.png");
  	expect(appl.selected_sheet().grid_width()).toEqual(-1);
  });
  
  it("it should add a sprite sheet item", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  });
  
  it("it should add a sprite list item", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.do_action(0,0);
  	expect(appl.sprite_list().length).toEqual(1);
  });
  
  it("it should add a layer", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	expect(appl.sprite_list()[0].layer()).toEqual("water");
  	expect(appl.layers()).toEqual(["background","water"]);
  });
    
  it("It should delete a layer (with all sprites)", function(){
    appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
    appl.do_action(10,10);
    appl.delete_layer();
    expect(appl.sprite_list().length).toEqual(0);
  	expect(appl.layers()).toEqual(["background"]);
  });
  
  it("It should not delete background layer", function(){
    appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.do_action(5,5);
    appl.do_action(50,50);
    appl.delete_layer();
    expect(appl.sprite_list().length).toEqual(2);
  	expect(appl.layers()).toEqual(["background"]);
  });
  
  it("should delete sprite list item", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.do_action(5,5);
  	appl.remove_sprite_list_item(6,8);
  	expect(appl.sprite_list().length).toEqual(0);
  });
  
  it("should delete sprite list item on new layer", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	appl.remove_sprite_list_item(6,8);
  	expect(appl.sprite_list().length).toEqual(0);
  });
  
  it("should not delete sprite list item on the background layer", function() {
  	appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	appl.selected_layer("background");
  	appl.remove_sprite_list_item(6,8);
  	expect(appl.sprite_list().length).toEqual(1);
  });
    
  it("should move layer", function() {
      // setup
    appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	appl.selected_layer("background");
  	appl.do_action(5,5);
  	expect(appl.sprite_list().length).toEqual(2);

  	expect(appl.layers()[1]).toEqual("water","pre-layer");  	
    expect(appl.layers()[0]).toEqual("background","pre-layer");
  	expect(appl.sprite_list()[1].layer()).toEqual("water","pre-sprite");
  	expect(appl.sprite_list()[0].layer()).toEqual("background","pre-sprite");
    
      // prep edit
    appl.edit_layers.removeAll();
    appl.edit_layers(appl.get_layers_for_update());
      
      // move layers
  	expect(appl.edit_layers()[0].title()).toEqual("background","ready to rename");
    appl.edit_layers()[0].title("backgrounds");
    var tlayer = appl.edit_layers.splice(0,1);
    appl.edit_layers.push(tlayer[0]);
      
      // test
    appl.update_layers(appl.edit_layers());
      
  	expect(appl.layers()[1]).toEqual("backgrounds","renamed");
  	expect(appl.layers()[0]).toEqual("water","layer 1 should be water");
  	expect(appl.sprite_list()[1].layer()).toEqual("backgrounds","renamed and moved");
  	expect(appl.sprite_list()[0].layer()).toEqual("water","moved");
  });
    
  it("should sort layer", function() {
      // setup
    appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("background");
  	appl.do_action(5,5);
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	expect(appl.sprite_list().length).toEqual(2);
  	expect(appl.sprite_list()[0].layer()).toEqual("background");  	
    expect(appl.sprite_list()[1].layer()).toEqual("water");
    
      // prep edit
    appl.edit_layers.removeAll();
    appl.edit_layers(appl.get_layers_for_update());
      
      // move layers
    var tlayer = appl.edit_layers.splice(0,1);
    appl.edit_layers.push(tlayer[0]);
      
      // test
    appl.update_layers(appl.edit_layers());
  	expect(appl.layers()[0]).toEqual("water");
  	expect(appl.layers()[1]).toEqual("background");
  	expect(appl.sprite_list()[0].layer()).toEqual("water");
  });
    
  it("should delete layer water", function() {
      // setup
    appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	appl.selected_layer("background");
    
      // prep edit
    appl.edit_layers.removeAll();
    appl.edit_layers(appl.get_layers_for_update());
      
      // delete water layer
    appl.edit_layers.splice(1,1);
      
      // test
    appl.update_layers(appl.edit_layers());
  	expect(appl.layers()[0]).toEqual("background");
  	expect(appl.layers().length).toEqual(1);
  });
    
  it("should rename layer", function() {
    appl.add_sprite_sheet("foo.png");
  	appl.sheet_drag_rect([0,0,grid_size,grid_size]);
  	appl.add_spite_sheet_item();
  	appl.selected_layer("water");
  	appl.do_action(5,5);
  	appl.selected_layer("background");
  	expect(appl.sprite_list().length).toEqual(1);
  });
  
  it("should save", function() {
  	var saved_map = appl.save();
  });
  
  it("should load", function() {
      var saved_map = {};
      appl.load(saved_map);
  });
});