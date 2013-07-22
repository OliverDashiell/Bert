
describe("Util", function() {


	it("it diff", function() {
        var a = ["dash","pete"];
        var b = ["pete"]
		expect(a.diff(b)).toEqual(["dash"]);		
        expect(b.diff(a)).toEqual([]);
	});
    
    it("it should subscribe", function(){
        var array = ko.observableArray();
        var a = "foo";
        var b = null;
        array.subscribe(function(item){
             b = item;   
        });
        array.push(a);
        expect(a).toEqual("foo");
        expect(b).toEqual(["foo"]);
        expect(a).toEqual(b[0]);
        expect(array().length).toEqual(1);
    });
    
});