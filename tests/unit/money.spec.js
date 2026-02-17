"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const money_value_object_1 = require("../../src/domain/value-objects/money.value-object");
describe('Money', () => {
    it('adds amounts in same currency', () => {
        const a = new money_value_object_1.Money(100, 'ETB');
        const b = new money_value_object_1.Money(50, 'ETB');
        expect(a.add(b).amount).toBe(150);
    });
    it('throws on currency mismatch', () => {
        const a = new money_value_object_1.Money(100, 'ETB');
        const b = new money_value_object_1.Money(10, 'USD');
        expect(() => a.add(b)).toThrow('Currency mismatch');
    });
});
