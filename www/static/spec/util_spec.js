
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
    
    it("it should sort one list by another", function(){
        var master_list = ['c','z','a','g'];
        var client_list = master_list.slice();
        
        client_list.sort();
        
        expect(client_list).toEqual(['a','c','g','z']);
        expect(master_list).toEqual(['c','z','a','g']);
        
        client_list.sort(function(l,r){
            var l_index = master_list.indexOf(l);
            var r_index = master_list.indexOf(r);
            
            return l_index - r_index;
        });
        
        expect(client_list).toEqual(['c','z','a','g']);
        expect(master_list).toEqual(['c','z','a','g']);
    });
    
});