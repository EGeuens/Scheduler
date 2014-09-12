"use strict";
var imports = {
	HelperFunctions: require("../../../api/util/HelperFunctions")
};

describe("HelperFunctions", function () {
	describe("objToArray", function () {
		it("should convert an object to an array", function () {
			var lTestObject = {
					key1: "value1"
				},
				lExpectedArray = ["value1"];

			expect(imports.HelperFunctions.objToArray(lTestObject)).toEqual(lExpectedArray);
		});
		it("should return a non-object", function () {
			var lTestObject = "value1";

			expect(imports.HelperFunctions.objToArray(lTestObject)).toEqual(lTestObject);
		});
	});
});
