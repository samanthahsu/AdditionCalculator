import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {AdditionCalculator, TooLarge, TooSimple} from "../src/AdditionCalculator";
import {testFolder} from "@ubccpsc310/folder-test";
import {describe, it} from "mocha";

chai.use(chaiAsPromised);

type Input = number[];
type Output = Promise<number>;
type Error = "TooSimple" | "TooLarge";

describe("AdditionCalculator", function() {
    
    describe("Add", function() {

        let additionCalc: AdditionCalculator
        beforeEach(function () {
            additionCalc = new AdditionCalculator();
        })

        it('should reject with TooSimple if arr is empty', function () {
            const result = additionCalc.add([]);
            return expect(result).eventually.to.rejectedWith(TooSimple)
        });
        it('should reject with TooLarge if arr is greater than 1000', function () {
            const result = additionCalc.add([10001, 1]);
            return expect(result).eventually.to.rejectedWith(TooLarge)
        });
    })
    
    testFolder<Input, Output, Error>(
        "Add Dynamic Tests",
        (input:Input): Output => {
            const additionCalculator = new AdditionCalculator();
            return additionCalculator.add(input);
        },
        "./test/resources/json",
        {
            errorValidator: (error): error is Error =>
                error === "TooSimple" || error === "TooLarge",
            assertOnError: ((expected, actual) => {
                if(expected === "TooSimple") {
                    expect(actual).to.be.instanceof(TooSimple);
                } else if (expected === "TooLarge") {
                    expect(actual).to.be.instanceof(TooLarge);
                } else {
                    expect.fail("UNEXPECTED ERROR");
                }
            })
        }
    )
});