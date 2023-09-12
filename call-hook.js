// initialize `imported` with function idx. of imported functions 
let imported = []

for (let i = 1; i < Wasabi.module.info.functions.length; i++) {
	// check if function.import is not null and push idx to `imported`		
	if (Wasabi.module.info.functions[i].import !== null) {
		imported.push(i)
	}
}

console.log(imported)

let loc_stack = []


let traces = []

// Analysis definition:
Wasabi.analysis = {
	start(location) {
		console.log(location, "start");
	},
	
	call_pre(location, targetFunc, args, indirectTableIdx) {
		if (imported.includes(targetFunc)) {
			console.log(">>> call pre, ", "func #:", targetFunc, "loc: ", location, "args: ", args);	
			loc_stack.push({loc: location, fn: targetFunc})
			// push trace
			traces.push({event: "call", loc: location, fn: targetFunc, args: args})
		}
	},

	/*
	return_(location, values) {
		//console.log("return", location)
		stack_top = loc_stack[loc_stack.length - 1]
		if (stack_top === undefined) {
		}
		else if (location.func == stack_top.loc.func && location.instr == stack_top.loc.instr) {
			console.log(location, (location.instr === -1) ? "implicit" : "explicit", "return, values = ", values);
		}
	},
	*/

	call_post(location, values) {
		stack_top = loc_stack[loc_stack.length - 1]
		if (stack_top === undefined) {
		}
		else if (location.func == stack_top.loc.func && location.instr == stack_top.loc.instr) {
			let top = loc_stack.pop()
			//console.log(">>> call post, ", "func #:", top.fn , "loc: ", location, ",call result: ", values);
			// push trace
			traces.push({event: "return", loc: location, fn: top.fn, return: values})
		}
	},

	// load and store
	load(location, op, memarg, value) {
        console.log(location, op, "value =", value, "from =", memarg);
	},

	store(location, op, memarg, value) {
			console.log(location, op, "value =", value, "to =", memarg);
	},
};

