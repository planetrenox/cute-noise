/**
 * @constant {number} INT_MAX - The maximum safe integer value (2^31 - 1).
 */
const INT_MAX = 2147483647;

/**
 * @constant {number[]} ITSAKINDOFMAGIC - An array of magic numbers used for generating the bitmask.
 */
const ITSAKINDOFMAGIC = [
    0x3, 0x6, 0x9, 0x1D, 0x36, 0x69, 0xA6, // 2 to 8
    0x17C, 0x32D, 0x4F2, 0xD34, 0x1349, 0x2532, 0x6699, 0xD295, // 9 - 16
    0x12933, 0x2C93E, 0x593CA, 0xAFF95, 0x12B6BC, 0x2E652E, 0x5373D6, 0x9CCDAE, // etc
    0x12BA74D, 0x36CD5A7, 0x4E5D793, 0xF5CDE95, 0x1A4E6FF2, 0x29D1E9EB, 0x7A5BC2E3, 0xB4BCD35C,
];

/**
 * Creates a new bitmeddler instance.
 * @constructor
 * @param {number} maximum - The maximum number (inclusive) to generate sequences up to.
 * @param {number} [seed=1] - The seed value for generating different sequences.
 * @throws {Error} Throws an error if the maximum is not between 2 and INT_MAX (inclusive).
 */
export function bitmeddler(maximum, seed)
{
    if (maximum < 2 || maximum > INT_MAX) {
        throw new Error(`\`maximum\` must be between 2 and ${INT_MAX} inclusive`);
    }

    this.maximum = maximum;
    this.start = (seed || 1) % maximum;
    this.cur = this.start;
    this.MASK = ITSAKINDOFMAGIC[this._msb(this.maximum) - 2];
    this.next = this._next;
}

bitmeddler.prototype = {
    /**
     * Generates the next number in the sequence.
     * @returns {number} The next number in the sequence.
     * @private
     */
    _next: function ()
    {
        do {
            this.cur = this.cur & 1 ? (this.cur = (this.cur >> 1) ^ this.MASK) : (this.cur >>= 1);
        }
        while (this.cur > this.maximum);

        if (this.cur === this.start) {
            this.next = this._done;
        }

        return this.cur;
    },

    /**
     * Indicates that the sequence is done.
     * @returns {null} Always returns null.
     * @private
     */
    _done: function ()
    {
        return null;
    },

    /**
     * Resets the sequence to the beginning.
     */
    reset: function ()
    {
        this.next = this._next;
        this.cur = this.start;
    },

    /**
     * Generates all numbers in the sequence.
     * @returns {number[]} An array containing all numbers in the sequence.
     */
    all: function ()
    {
        this.reset();
        const o = [];
        let v;
        while ((v = this.next())) {
            o.push(v);
        }
        return o;
    },

    /**
     * Calculates the most significant bit (MSB) of a number.
     * @param {number} v - The number to calculate the MSB for.
     * @returns {number} The index of the MSB (1-based).
     * @private
     */
    _msb: function (v)
    {
        let r = 0;
        while (v) {
            v >>= 1;
            r++;
        }
        return r;
    },
};