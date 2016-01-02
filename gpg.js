/*
Greno's password generator
Use statistic data from http://www.multicians.org/thvv/gpw-js.html
Version 1.0

Copyright (c) 2015 Greno
Released under the MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
	// Greno's password generator
	this.GPG = function() {
		// password store assembled password
		this.password = '';

		// default options 
		var defaults = {
			// length of password
			password_length: 12,
			// use uppercase letters
			upper: true,
			// use lowercase letters
			lower: true,
			// use special characters
			special: true,
			// use numbers
			numbers: true,
			// use similar characters like l, 1, I....
			similar: false,
			// should be password pronounceable
			pronounceable: false,
			// use mask for password generator
			// mask is string similar to regex (but not regex) eg [a]{1,4}[@]{2}[1A]{1}
			mask: false,
			// shuffle generated password based on mask
			shuffle_mask: true,

			// alphabets
			// similar characters which will not be used if similar is false
			similar_alphabet: 'O01lI',
			// alphabet for lowercase letters
			lower_alphabet: 'abcdefghijklmnopqrstuvwxyz',
			// alphabet for uppercase letters
			upper_alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			// alphabet for numbers
			numbers_alphabet: '0123456789',
			// alphabet for special characters
			special_alphabet: '#&@{}^~[]|$*><;,._-?:)(!%='
		};

		// override default options
		this.options = defaults;
		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = extendDefaults(defaults, arguments[0]);
		}
	} // GPG function

	/*
	Main generate function
	Generate password based on options. Generate one password.
	Sequence of generation is:
	- if mask string is set, password is generated based on this mask string. Pronounceable and password length option are ignored
	- if pronounceable is set to true, pronounceable password is generated
	- if mask is set to false and pronounceable is also set to false, random password is generated

	Return: string with password
	*/
	GPG.prototype.generate = function() {
		var password = '';

		if(this.options.mask && typeof this.options.mask === 'string') {
			// mask is set
			var match, results = [];

			var re = /\[([aA1@]+)\]\{(\d+)\,*(\d*)\}/g;

			while(match = re.exec(this.options.mask)) {
				results.push(match);
			}
			
			for(i = 0; i < results.length; i++) {
				var pass_part = '';
				var opt = results[i][1];
				var min = results[i][2];
				var max = (results[i][3] == '' ? results[i][2] : results[i][3]);
				var alphabet = '';

				// check if user want lower
				if(opt.indexOf('a') !== -1) {
					pass_part += this.__picker(min, max, this.options.lower_alphabet);
				}
				if(opt.indexOf('A') !== -1) {
					pass_part += this.__picker(min, max, this.options.upper_alphabet);
				}
				if(opt.indexOf('1') !== -1) {
					pass_part += this.__picker(min, max, this.options.numbers_alphabet);
				}
				if(opt.indexOf('@') !== -1) {
					pass_part += this.__picker(min, max, this.options.special_alphabet);
				}

				
				password += shuffleString(pass_part);
			}

			if(this.options.shuffle_mask) {
				password += shuffleString(password);
			}

		} else if(this.options.pronounceable) {
			// password should be pronounceable
			if(!this.options.upper && !this.options.lower) {
				throw new Error('You can not generate pronounceable password without letters');
			}

			var probabilities = {"a":{"b":{"a":37,"b":25,"e":38,"i":46,"l":304,"o":49,"r":24,"s":24,"u":19,"y":14},"c":{"a":26,"c":64,"e":107,"h":94,"i":67,"k":173,"l":13,"o":35,"q":13,"r":32,"t":114,"u":23,"y":45},"d":{"a":35,"d":43,"e":116,"i":75,"j":14,"l":16,"m":25,"o":44,"r":35,"s":20,"u":10,"v":25,"y":18},"e":{"l":10,"r":12},"f":{"e":14,"f":50,"t":39},"g":{"a":30,"e":182,"g":42,"i":30,"n":42,"o":51,"r":24,"u":21},"h":{"a":12,"e":20,"o":13},"i":{"c":10,"d":26,"g":10,"l":87,"m":13,"n":144,"r":93,"s":30,"t":23},"k":{"a":11,"e":98,"i":15},"l":{"a":78,"b":20,"c":34,"d":45,"e":124,"f":21,"g":24,"i":109,"k":28,"l":237,"m":31,"o":53,"p":23,"s":16,"t":69,"u":29,"v":26,"y":26},"m":{"a":70,"b":57,"e":98,"i":68,"m":38,"o":43,"p":69,"s":14,"u":12,"y":14},"n":{"a":114,"c":156,"d":359,"e":103,"g":146,"h":12,"i":141,"k":57,"n":89,"o":61,"s":124,"t":443,"u":29,"y":28},"p":{"a":29,"e":59,"h":86,"i":25,"l":14,"o":37,"p":94,"s":22,"t":30},"q":{"u":14},"r":{"a":124,"b":64,"c":101,"d":233,"e":115,"f":12,"g":47,"i":188,"k":61,"l":55,"m":68,"n":34,"o":46,"p":25,"r":94,"s":48,"t":189,"v":22,"y":172},"s":{"a":19,"c":32,"e":71,"h":81,"i":49,"k":22,"m":19,"o":19,"p":34,"s":152,"t":211,"u":12,"y":17},"t":{"a":50,"c":41,"e":863,"h":144,"i":352,"l":14,"o":144,"r":60,"s":13,"t":106,"u":57},"u":{"c":23,"d":35,"g":38,"l":33,"n":23,"r":35,"s":52,"t":56},"v":{"a":35,"e":108,"i":49,"o":19},"w":{"a":30,"b":10,"k":10,"l":13,"n":15},"x":{"i":22},"y":{"a":11,"e":16,"l":10,"o":13},"z":{"a":10,"e":22,"i":10,"z":11}},"b":{"a":{"b":17,"c":74,"d":11,"g":19,"k":10,"l":68,"n":73,"r":110,"s":54,"t":55,"y":12},"b":{"e":16,"i":10,"l":24,"y":14},"e":{"a":51,"c":14,"d":34,"e":18,"f":11,"g":16,"l":85,"n":48,"r":199,"s":36,"t":41},"i":{"a":34,"c":22,"d":21,"l":50,"n":45,"o":16,"r":29,"s":22,"t":59},"l":{"a":57,"e":519,"i":35,"o":47,"u":32},"o":{"a":62,"d":21,"l":46,"n":63,"o":58,"r":55,"s":15,"t":20,"u":46,"w":17,"x":10,"y":19},"r":{"a":110,"e":77,"i":100,"o":78,"u":28,"y":10},"s":{"e":16,"o":12,"t":27},"u":{"c":21,"d":16,"g":14,"i":12,"l":52,"n":20,"r":104,"s":44,"t":54}},"c":{"a":{"b":47,"c":17,"d":33,"l":120,"m":40,"n":120,"p":59,"r":171,"s":60,"t":150,"u":19,"v":20},"c":{"a":23,"e":22,"i":13,"l":13,"o":26,"u":27},"e":{"a":23,"d":17,"i":13,"l":50,"m":12,"n":109,"p":43,"r":76,"s":63,"t":22},"h":{"a":165,"b":10,"e":176,"i":141,"l":26,"m":20,"n":16,"o":102,"r":63,"t":10,"u":44,"w":13,"y":20},"i":{"a":76,"b":15,"d":33,"e":24,"f":16,"l":38,"n":45,"o":50,"p":28,"r":29,"s":38,"t":71},"k":{"a":17,"b":16,"e":90,"i":20,"l":45,"o":12,"s":32,"w":13,"y":22},"l":{"a":95,"e":84,"i":50,"o":54,"u":34},"o":{"a":33,"b":16,"c":40,"d":22,"e":14,"f":10,"g":11,"h":12,"l":101,"m":218,"n":421,"o":24,"p":56,"r":129,"s":37,"t":40,"u":86,"v":22,"w":25},"q":{"u":13},"r":{"a":101,"e":112,"i":75,"o":88,"u":41,"y":25},"t":{"a":44,"e":12,"i":113,"o":94,"r":46,"u":42},"u":{"b":12,"l":102,"m":42,"n":10,"p":15,"r":72,"s":51,"t":41},"y":{"c":20}},"d":{"a":{"c":16,"g":13,"i":18,"l":54,"m":23,"n":59,"p":10,"r":31,"t":40,"v":13,"y":32},"d":{"e":30,"i":19,"l":38,"y":16},"e":{"a":34,"b":37,"c":82,"d":14,"e":17,"f":41,"g":11,"l":88,"m":62,"n":170,"o":14,"p":40,"r":183,"s":99,"t":39,"v":20,"w":16},"g":{"e":73},"h":{"o":10},"i":{"a":100,"b":10,"c":104,"d":12,"e":33,"f":26,"g":31,"l":22,"m":22,"n":65,"o":57,"p":15,"r":20,"s":138,"t":53,"u":20,"v":31},"l":{"e":79,"i":12},"m":{"a":13,"i":21,"o":11},"o":{"c":21,"d":10,"g":20,"l":30,"m":38,"n":54,"o":17,"r":39,"s":11,"t":10,"u":30,"w":54},"r":{"a":74,"e":47,"i":53,"o":80,"u":22},"s":{"e":10,"m":10,"o":16,"t":31},"u":{"a":10,"c":52,"l":33,"m":14,"n":15,"p":11,"r":19,"s":15},"v":{"e":13},"w":{"a":19,"e":10,"i":19},"y":{"n":12}},"e":{"a":{"b":39,"c":34,"d":110,"f":12,"g":13,"k":50,"l":68,"m":38,"n":71,"p":13,"r":117,"s":80,"t":112,"u":28,"v":19},"b":{"a":32,"e":31,"o":28,"r":32,"u":29},"c":{"a":33,"e":51,"h":39,"i":49,"k":47,"l":26,"o":59,"r":35,"t":206,"u":42},"d":{"a":29,"d":16,"e":45,"g":22,"i":88,"o":24,"r":27,"u":27,"y":13},"e":{"c":13,"d":63,"i":10,"k":19,"l":23,"m":13,"n":66,"p":42,"r":43,"t":34},"f":{"a":14,"e":36,"f":33,"i":22,"l":15,"o":24,"r":14,"t":13,"u":35},"g":{"a":48,"e":36,"g":15,"i":38,"o":26,"r":38,"u":19},"h":{"a":14,"e":24,"o":18},"i":{"d":13,"g":42,"l":13,"n":59,"r":10,"s":25,"t":22},"l":{"a":76,"d":57,"e":131,"f":19,"i":125,"l":238,"m":22,"o":48,"p":15,"s":27,"t":26,"u":17,"v":19},"m":{"a":87,"b":53,"e":84,"i":102,"o":56,"p":64,"u":19},"n":{"a":78,"b":17,"c":68,"d":159,"e":128,"g":35,"h":14,"i":96,"n":54,"o":57,"s":127,"t":624,"u":33,"v":10,"y":11,"z":16},"o":{"d":10,"l":23,"m":10,"n":38,"p":16,"r":14,"u":41},"p":{"a":26,"e":27,"h":32,"i":45,"l":21,"o":35,"r":35,"s":10,"t":65,"u":13},"q":{"u":59},"r":{"a":217,"b":57,"c":66,"d":22,"e":190,"f":41,"g":70,"h":13,"i":200,"k":14,"l":40,"m":134,"n":117,"o":113,"p":42,"r":123,"s":167,"t":135,"u":23,"v":58,"w":22,"y":123},"s":{"a":17,"c":74,"e":58,"h":25,"i":82,"m":17,"o":34,"p":52,"s":222,"t":278,"u":18},"t":{"a":78,"c":19,"e":129,"h":93,"i":105,"o":50,"r":73,"t":113,"u":17,"y":32},"u":{"m":17,"p":15,"r":46,"s":20,"t":18},"v":{"a":29,"e":121,"i":56,"o":26},"w":{"a":33,"e":16,"i":24,"o":23,"s":15},"x":{"a":29,"c":43,"e":20,"h":14,"i":21,"o":15,"p":78,"t":72,"u":12},"y":{"e":25}},"f":{"a":{"b":10,"c":39,"i":18,"l":35,"m":10,"n":27,"r":36,"s":13,"t":18,"u":10},"e":{"a":18,"c":24,"e":12,"l":25,"n":18,"r":114,"s":17,"t":15},"f":{"a":10,"e":51,"i":45,"l":21,"o":13},"i":{"c":58,"d":18,"e":42,"g":11,"l":29,"n":53,"r":40,"s":41,"t":18,"x":10},"l":{"a":64,"e":50,"i":21,"o":60,"u":42,"y":15},"o":{"l":34,"o":32,"r":165,"u":25},"r":{"a":64,"e":66,"i":35,"o":35,"u":11},"t":{"e":19},"u":{"l":119,"n":24,"r":28,"s":31}},"g":{"a":{"b":20,"d":11,"g":11,"i":13,"l":68,"m":24,"n":60,"r":63,"s":23,"t":68,"u":15},"e":{"a":23,"e":12,"l":32,"n":141,"o":39,"r":96,"s":29,"t":33},"g":{"e":20,"i":60,"l":24,"y":12},"h":{"a":18,"e":12,"o":12,"t":153},"i":{"a":23,"b":21,"c":16,"l":24,"n":103,"o":17,"r":10,"s":26,"t":19,"v":10},"l":{"a":49,"e":73,"i":25,"o":38,"u":13,"y":17},"m":{"a":23,"e":12},"n":{"a":26,"e":28,"i":20,"o":26},"o":{"d":16,"g":10,"l":22,"n":49,"o":20,"r":34,"s":12,"t":23,"u":16},"r":{"a":216,"e":97,"i":43,"o":50,"u":14},"s":{"t":18},"t":{"o":17},"u":{"a":28,"e":49,"i":41,"l":26,"m":15,"n":24,"r":14,"s":22}},"h":{"a":{"b":26,"c":15,"d":20,"g":22,"i":31,"k":11,"l":90,"m":66,"n":171,"p":25,"r":142,"s":30,"t":49,"u":20,"v":11,"w":20,"y":13},"b":{"o":12},"e":{"a":123,"c":22,"d":33,"e":37,"i":27,"l":87,"m":65,"n":86,"o":17,"r":311,"s":57,"t":42,"u":11,"v":11,"w":14,"y":11},"f":{"u":10},"i":{"a":22,"b":22,"c":56,"d":15,"e":23,"g":19,"l":73,"m":20,"n":79,"o":17,"p":41,"r":36,"s":53,"t":39,"v":11},"l":{"e":11,"o":22},"m":{"a":21,"e":15},"o":{"a":13,"b":18,"c":13,"d":25,"e":17,"g":13,"l":101,"m":62,"n":62,"o":44,"p":29,"r":130,"s":45,"t":33,"u":81,"w":28},"r":{"a":20,"e":23,"i":40,"o":72,"u":13},"t":{"e":21},"u":{"b":13,"g":12,"m":37,"n":26,"r":37,"s":24,"t":15},"w":{"a":17},"y":{"d":39,"l":13,"p":25,"s":29}},"i":{"a":{"b":33,"c":20,"g":17,"l":169,"m":20,"n":230,"r":30,"s":13,"t":91},"b":{"a":11,"b":19,"e":38,"i":22,"l":131,"o":10,"r":20,"u":23},"c":{"a":161,"e":113,"h":62,"i":113,"k":142,"l":15,"o":46,"r":12,"t":53,"u":42},"d":{"a":51,"d":31,"e":232,"g":30,"i":46,"o":10,"s":10,"u":11},"e":{"c":17,"f":16,"g":11,"l":52,"n":70,"r":66,"s":18,"t":50,"v":17},"f":{"e":31,"f":45,"i":27,"o":10,"t":24,"u":10,"y":71},"g":{"a":48,"e":41,"g":30,"h":147,"i":30,"m":15,"n":57,"o":20,"r":23,"u":15},"k":{"e":17},"l":{"a":60,"b":10,"d":36,"e":106,"i":90,"k":13,"l":253,"m":14,"o":24,"s":10,"t":31,"y":10},"m":{"a":76,"b":26,"e":94,"i":53,"m":38,"o":30,"p":133,"u":17},"n":{"a":212,"b":12,"c":143,"d":168,"e":396,"f":83,"g":435,"h":26,"i":94,"k":43,"n":44,"o":70,"q":10,"s":139,"t":205,"u":35,"v":46,"y":15},"o":{"c":20,"d":10,"l":28,"m":12,"n":604,"r":25,"s":13,"t":24,"u":139},"p":{"a":20,"e":26,"h":16,"i":16,"l":33,"o":13,"p":39,"s":19,"t":28},"q":{"u":36},"r":{"a":41,"c":39,"d":24,"e":106,"i":19,"k":11,"l":20,"m":24,"o":24,"r":39,"s":11,"t":31,"y":10},"s":{"a":35,"c":71,"e":110,"h":189,"i":56,"k":13,"l":12,"m":93,"o":55,"p":33,"s":85,"t":271},"t":{"a":136,"c":34,"e":184,"h":77,"i":158,"o":70,"r":31,"t":105,"u":72,"y":142,"z":19},"u":{"m":121,"s":19},"v":{"a":57,"e":292,"i":37,"o":12},"z":{"e":13,"z":16}},"j":{"a":{"c":32,"n":17},"e":{"c":24,"r":11},"o":{"h":12,"i":10,"r":10,"s":10,"u":13},"u":{"d":19,"n":24,"r":15}},"k":{"a":{"n":13,"r":18,"t":17},"b":{"o":11},"e":{"e":28,"l":20,"n":55,"r":59,"s":18,"t":56,"y":27},"i":{"e":15,"l":10,"m":10,"n":87,"r":11,"s":15,"t":13},"l":{"a":15,"e":46,"i":13},"m":{"a":13},"n":{"e":11,"i":10,"o":24},"r":{"a":10},"s":{"t":11}},"l":{"a":{"b":46,"c":84,"d":43,"g":46,"i":52,"k":10,"m":64,"n":242,"p":23,"r":157,"s":92,"t":210,"u":45,"v":21,"w":23,"y":42,"z":11},"b":{"a":12,"e":17,"o":13},"c":{"h":12,"o":19},"d":{"e":41,"i":16,"o":13},"e":{"a":94,"b":25,"c":75,"d":44,"e":36,"f":13,"g":55,"i":26,"m":55,"n":121,"o":22,"p":22,"r":77,"s":84,"t":115,"u":12,"v":29,"w":14,"x":30,"y":75},"f":{"i":12},"g":{"a":16,"e":12,"i":10},"i":{"a":82,"b":33,"c":140,"d":26,"e":43,"f":37,"g":73,"l":11,"m":46,"n":238,"o":50,"p":40,"q":13,"s":90,"t":127,"u":12,"v":36},"l":{"a":128,"b":12,"e":169,"i":152,"o":100,"s":10,"u":41,"y":53},"m":{"a":27,"e":11,"o":13},"o":{"a":23,"b":23,"c":65,"d":15,"g":132,"i":32,"m":29,"n":69,"o":50,"p":36,"q":11,"r":74,"s":33,"t":53,"u":66,"v":16,"w":80,"y":12},"p":{"a":11,"h":21},"s":{"e":16,"i":23,"o":20,"t":23},"t":{"a":22,"e":23,"h":14,"i":34,"o":23,"y":18},"u":{"b":17,"c":26,"d":18,"e":31,"g":13,"m":68,"n":31,"o":15,"r":21,"s":68,"t":56,"x":13},"v":{"a":19,"e":46},"y":{"c":12,"m":13,"n":11,"p":11,"s":31,"t":15}},"m":{"a":{"b":10,"c":59,"d":34,"g":57,"i":31,"k":25,"l":104,"n":326,"r":144,"s":49,"t":192,"u":10,"x":11,"y":14},"b":{"a":31,"e":44,"i":32,"l":31,"o":27,"r":32,"u":21},"c":{"c":17},"e":{"a":30,"d":45,"g":14,"l":51,"m":19,"n":283,"o":10,"r":125,"s":39,"t":128},"i":{"a":19,"c":93,"d":54,"g":19,"l":76,"n":194,"r":21,"s":96,"t":109,"u":10},"m":{"a":40,"e":46,"i":33,"o":32,"u":17,"y":12},"n":{"a":12,"i":10},"o":{"b":10,"c":13,"d":28,"g":14,"i":11,"l":47,"m":10,"n":168,"o":16,"r":107,"s":40,"t":45,"u":56},"p":{"a":52,"e":71,"h":26,"i":18,"l":71,"o":50,"r":41,"t":43,"u":19},"s":{"t":10},"u":{"d":11,"l":55,"m":11,"n":29,"r":18,"s":53,"t":30},"y":{"c":11}},"n":{"a":{"b":24,"c":33,"d":23,"g":30,"i":20,"l":115,"m":29,"n":59,"p":31,"r":94,"s":28,"t":159,"u":19,"v":10},"b":{"e":20,"u":10},"c":{"a":25,"e":190,"h":87,"i":51,"l":18,"o":62,"r":16,"t":36,"u":21},"d":{"a":75,"b":11,"e":162,"i":102,"l":22,"m":10,"o":57,"r":46,"s":30,"u":37,"w":11,"y":20},"e":{"a":34,"b":12,"c":36,"d":12,"e":29,"f":17,"g":16,"i":14,"l":45,"m":16,"n":20,"o":25,"r":88,"s":80,"t":84,"u":32,"v":12,"w":37,"x":18,"y":45},"f":{"a":15,"e":30,"i":38,"l":23,"o":26,"r":10,"u":19},"g":{"a":22,"e":114,"h":15,"i":18,"l":51,"o":20,"r":24,"s":24,"t":28,"u":38},"h":{"a":18,"e":16,"o":15},"i":{"a":90,"c":148,"d":14,"e":33,"f":27,"g":35,"l":12,"m":25,"n":44,"o":26,"p":21,"s":87,"t":94,"u":29,"v":11},"j":{"u":13},"k":{"e":22,"i":10,"l":12},"n":{"a":39,"e":74,"i":52,"o":23,"u":14,"y":25},"o":{"b":18,"c":21,"d":10,"g":15,"i":11,"l":30,"m":60,"n":34,"o":11,"p":11,"r":80,"s":32,"t":47,"u":52,"v":18,"w":24},"q":{"u":22},"s":{"a":26,"c":23,"e":73,"f":17,"h":12,"i":96,"m":13,"o":60,"p":25,"t":79,"u":39},"t":{"a":143,"e":175,"h":64,"i":209,"l":13,"o":65,"r":114,"u":32,"y":21},"u":{"a":12,"c":16,"e":11,"l":15,"m":35,"s":25,"t":31},"v":{"a":15,"e":43,"i":20,"o":17},"w":{"a":12},"y":{"m":14},"z":{"a":10}},"o":{"a":{"c":20,"d":30,"n":18,"r":51,"s":13,"t":44},"b":{"a":17,"b":24,"e":28,"i":32,"l":19,"o":16,"s":26},"c":{"a":50,"c":28,"e":38,"h":47,"i":26,"k":129,"l":14,"o":33,"r":25,"t":34,"u":20},"d":{"a":17,"d":15,"e":59,"g":13,"i":47,"l":13,"o":22,"s":11,"u":21,"y":35},"e":{"l":10,"n":13,"r":10,"s":15},"f":{"f":63,"i":10,"t":15},"g":{"a":34,"e":44,"g":22,"i":15,"l":11,"n":11,"r":80,"u":18,"y":83},"h":{"a":10},"i":{"c":12,"d":53,"l":27,"n":51,"r":11,"s":39},"k":{"e":48},"l":{"a":71,"d":83,"e":111,"i":121,"k":14,"l":124,"m":16,"o":132,"s":18,"t":24,"u":43,"v":16,"y":46},"m":{"a":89,"b":50,"e":174,"i":76,"m":64,"o":56,"p":125,"y":22},"n":{"a":129,"c":64,"d":82,"e":181,"f":52,"g":86,"i":124,"j":10,"k":11,"n":46,"o":75,"r":10,"s":107,"t":149,"v":38,"y":54},"o":{"d":92,"f":22,"k":68,"l":42,"m":42,"n":44,"p":19,"r":21,"s":21,"t":68},"p":{"a":28,"e":71,"h":82,"i":32,"l":16,"o":45,"p":29,"r":17,"s":14,"t":21,"u":10,"y":19},"q":{"u":14},"r":{"a":122,"b":26,"c":31,"d":96,"e":138,"g":34,"i":143,"k":61,"m":85,"n":76,"o":61,"p":59,"r":58,"s":46,"t":211,"u":11,"y":116},"s":{"a":31,"c":24,"e":107,"h":18,"i":102,"o":18,"p":42,"s":63,"t":127},"t":{"a":45,"c":11,"e":64,"h":88,"i":63,"l":10,"o":42,"r":17,"t":63,"y":11},"u":{"b":11,"c":17,"d":13,"g":62,"l":32,"n":137,"p":11,"r":86,"s":445,"t":103},"v":{"a":26,"e":109,"i":27},"w":{"a":18,"b":14,"d":13,"e":48,"l":28,"n":83,"s":13},"x":{"i":26,"y":14},"y":{"a":15}},"p":{"a":{"c":38,"d":11,"g":18,"i":17,"l":50,"n":73,"p":23,"r":176,"s":50,"t":101,"u":18,"y":10},"e":{"a":51,"c":62,"d":34,"e":19,"l":47,"n":108,"p":10,"r":292,"s":22,"t":50},"h":{"a":56,"e":88,"i":76,"o":97,"r":13,"y":79},"i":{"a":21,"c":74,"d":25,"e":33,"g":19,"l":27,"n":74,"o":12,"p":11,"r":37,"s":27,"t":57},"l":{"a":150,"e":121,"i":59,"o":33,"u":29,"y":11},"o":{"c":19,"d":10,"e":12,"i":31,"k":12,"l":111,"m":14,"n":55,"o":23,"p":17,"r":97,"s":126,"t":52,"u":20,"w":13},"p":{"a":16,"e":48,"i":20,"l":32,"o":25,"r":32,"y":16},"r":{"a":39,"e":166,"i":104,"o":273,"u":12},"s":{"e":17,"i":22,"o":13,"t":14,"y":35},"t":{"a":16,"i":107,"o":33,"u":19},"u":{"l":41,"n":22,"r":39,"s":18,"t":28},"y":{"r":20}},"q":{"u":{"a":110,"e":100,"i":128,"o":13}},"r":{"a":{"b":72,"c":130,"d":95,"f":35,"g":73,"h":14,"i":85,"k":10,"l":121,"m":95,"n":313,"p":119,"r":26,"s":66,"t":277,"u":19,"v":45,"w":28,"y":28,"z":13},"b":{"a":32,"e":26,"i":35,"o":44},"c":{"a":18,"e":47,"h":86,"i":25,"l":11,"o":13,"u":38},"d":{"a":22,"e":26,"i":42,"o":17},"e":{"a":166,"b":26,"c":106,"d":99,"e":114,"f":52,"g":55,"h":20,"i":25,"l":60,"m":69,"n":143,"o":20,"p":72,"r":11,"s":257,"t":119,"u":14,"v":56,"w":34,"y":23},"f":{"a":11,"e":15,"u":12},"g":{"a":26,"e":63,"i":25,"l":11,"o":18,"u":13,"y":11},"h":{"a":11,"e":19,"o":18},"i":{"a":182,"b":54,"c":210,"d":87,"e":79,"f":38,"g":65,"l":49,"m":65,"n":166,"o":82,"p":61,"s":151,"t":141,"u":29,"v":44,"z":10},"k":{"e":19,"s":10},"l":{"a":24,"e":28,"i":36,"o":14},"m":{"a":97,"e":29,"i":65,"o":39,"u":10},"n":{"a":53,"e":50,"i":29,"o":16},"o":{"a":46,"b":40,"c":79,"d":40,"e":18,"f":22,"g":56,"i":32,"k":10,"l":76,"m":90,"n":167,"o":84,"p":127,"r":14,"s":127,"t":74,"u":127,"v":42,"w":63,"x":17,"y":15},"p":{"a":10,"e":21,"h":33,"i":10,"o":25,"r":12},"q":{"u":10},"r":{"a":53,"e":92,"i":85,"o":47,"u":14,"y":60},"s":{"a":26,"e":84,"h":16,"i":44,"o":43,"p":12,"t":32,"u":14},"t":{"a":39,"e":61,"h":101,"i":99,"l":11,"o":32,"r":17,"s":12,"u":27,"y":24},"u":{"b":21,"c":30,"d":31,"e":15,"g":12,"i":18,"l":10,"m":46,"n":41,"p":28,"s":83,"t":22},"v":{"a":31,"e":37,"i":28},"w":{"a":15,"i":12,"o":15},"y":{"l":10,"m":11,"o":12,"p":16}},"s":{"a":{"b":44,"c":23,"d":16,"f":10,"g":21,"i":16,"l":80,"m":17,"n":89,"p":10,"r":36,"s":10,"t":43,"u":22,"v":10,"w":13},"b":{"u":18},"c":{"a":81,"e":65,"h":78,"i":37,"o":88,"r":92,"u":40},"d":{"a":11},"e":{"a":38,"b":14,"c":47,"d":18,"e":33,"i":11,"l":63,"m":39,"n":101,"p":28,"q":14,"r":83,"s":28,"t":41,"u":12,"v":19,"w":15,"x":15,"y":19},"h":{"a":97,"e":79,"i":75,"m":16,"o":81,"r":27,"u":20,"y":17},"i":{"a":55,"b":56,"c":44,"d":80,"e":28,"f":15,"g":38,"l":50,"m":40,"n":78,"o":148,"s":99,"t":89,"v":76},"k":{"e":24,"i":35,"y":23},"l":{"a":42,"e":35,"i":29,"o":29,"u":13},"m":{"a":57,"e":30,"i":31,"o":25,"u":14},"n":{"a":21,"e":12,"i":12,"o":19},"o":{"c":26,"d":12,"f":10,"l":67,"m":65,"n":190,"p":21,"r":71,"t":11,"u":34},"p":{"a":63,"e":116,"h":41,"i":82,"l":24,"o":69,"r":34,"u":16},"q":{"u":52},"s":{"a":50,"e":77,"i":151,"m":11,"o":42,"u":17,"w":13,"y":19},"t":{"a":258,"e":291,"h":11,"i":240,"l":25,"m":12,"o":205,"r":255,"u":58,"y":36},"u":{"a":14,"b":38,"c":17,"f":11,"i":11,"l":39,"m":35,"n":37,"p":42,"r":71,"s":30},"w":{"a":37,"e":31,"i":28,"o":21},"y":{"c":32,"l":18,"m":19,"n":30}},"t":{"a":{"b":74,"c":44,"g":45,"i":68,"k":15,"l":130,"m":36,"n":181,"p":23,"r":128,"s":22,"t":185,"u":13,"v":11,"x":13},"c":{"h":112},"e":{"a":52,"c":29,"d":37,"e":66,"g":17,"i":16,"l":65,"m":49,"n":185,"o":18,"p":20,"r":588,"s":61,"t":23,"x":16},"f":{"u":24},"h":{"a":68,"e":274,"i":62,"m":13,"o":90,"r":61,"u":31,"w":16,"y":49},"i":{"a":99,"b":35,"c":342,"d":16,"e":35,"f":45,"g":34,"l":67,"m":75,"n":183,"o":419,"p":28,"r":18,"s":75,"t":88,"v":128},"l":{"a":18,"e":102},"m":{"a":25,"o":11},"o":{"c":34,"d":11,"g":26,"i":14,"l":38,"m":65,"n":238,"o":26,"p":56,"r":319,"s":19,"t":16,"u":36,"w":36},"r":{"a":315,"e":98,"i":246,"o":201,"u":68,"y":64},"s":{"e":10,"m":13},"t":{"a":44,"e":154,"i":53,"l":45,"o":33,"r":10,"y":25},"u":{"a":41,"b":14,"d":41,"i":10,"l":19,"m":30,"n":29,"o":13,"p":10,"r":159,"s":35,"t":22},"w":{"a":14,"e":12,"i":23,"o":15},"y":{"l":14,"p":34,"r":14}},"u":{"a":{"d":21,"l":51,"n":26,"r":48,"t":37},"b":{"b":18,"e":20,"i":18,"l":23,"r":10,"s":15},"c":{"a":10,"c":14,"e":23,"h":31,"i":29,"k":55,"l":16,"t":47},"d":{"a":17,"d":24,"e":67,"g":18,"i":39,"s":10},"e":{"l":21,"n":33,"r":19,"s":22,"t":15},"f":{"f":58},"g":{"a":19,"e":21,"g":34,"h":80,"u":11},"i":{"c":14,"d":14,"l":32,"n":31,"r":19,"s":44,"t":64},"k":{"e":12},"l":{"a":136,"c":11,"d":11,"e":46,"f":14,"i":35,"k":10,"l":67,"o":23,"p":16,"s":24,"t":73,"u":16},"m":{"a":22,"b":52,"e":51,"i":32,"m":28,"n":11,"p":48},"n":{"a":21,"c":73,"d":131,"e":25,"g":46,"i":55,"k":33,"n":13,"s":15,"t":82},"o":{"r":16,"u":29},"p":{"e":31,"h":14,"i":10,"l":13,"p":24,"r":13,"s":13,"t":24},"r":{"a":75,"b":27,"c":21,"d":17,"e":149,"g":60,"i":66,"k":11,"l":17,"m":11,"n":55,"o":28,"p":15,"r":51,"s":43,"t":43,"v":15,"y":28},"s":{"a":31,"c":29,"e":105,"h":53,"i":64,"k":17,"p":12,"s":34,"t":115},"t":{"a":45,"c":14,"e":69,"h":55,"i":77,"o":49,"r":13,"t":51,"u":11},"z":{"z":12}},"v":{"a":{"c":20,"g":14,"l":69,"n":57,"r":31,"s":18,"t":36},"e":{"l":47,"n":120,"r":271,"s":46,"t":24,"y":10},"i":{"a":37,"c":33,"d":23,"e":21,"l":43,"n":47,"o":18,"r":16,"s":65,"t":30,"v":16},"o":{"c":23,"l":48,"r":10,"u":10},"u":{"l":13}},"w":{"a":{"g":12,"i":18,"l":53,"n":20,"r":100,"s":27,"t":55,"y":71},"b":{"o":10},"e":{"a":30,"e":33,"i":19,"l":51,"n":11,"r":36,"s":21},"h":{"a":18,"e":47,"i":52,"o":19},"i":{"c":14,"d":18,"g":15,"l":40,"n":83,"s":38,"t":47},"n":{"s":10},"o":{"l":10,"m":17,"o":54,"r":121},"r":{"e":12,"i":25,"o":10}},"x":{"c":{"e":11},"i":{"c":12,"m":11},"o":{"n":10},"p":{"e":27,"l":18,"o":12},"t":{"e":22,"r":31}},"y":{"a":{"l":11,"n":29,"r":20},"c":{"e":18,"h":31,"l":19,"o":12},"d":{"e":12,"r":37},"e":{"a":11,"l":13,"r":19},"h":{"o":10},"l":{"a":15,"e":22,"i":13,"l":19,"o":11},"m":{"a":18,"e":20,"o":11,"p":20},"n":{"a":14,"c":11,"e":12,"o":11},"o":{"n":18,"u":17},"p":{"e":24,"h":17,"o":21,"t":16},"r":{"a":15,"i":21,"o":29},"s":{"e":12,"i":38,"t":39},"t":{"e":16},"e":{"n":12,"r":13},"l":{"e":16},"o":{"n":10},"z":{"l":17}}};


			var list1 = Object.keys(probabilities);

			while(password.length < this.options.password_length) {
				var char1 = list1[getRandomInt(0, list1.length-1)];

				// check for char1
				if(!char1) {
					continue;
				}

				var list2 = Object.keys(probabilities[char1]);
				var char2 = list2[getRandomInt(0, list2.length-1)];

				var list3 = Object.keys(probabilities[char1][char2]);
				var char3 = list3[getRandomInt(0, list3.length-1)];

				var check1 = this.__checkForPronounceable(char1);
				if(!check1) {
					continue;
				} else {
					password += check1;
				}

				var check2 = this.__checkForPronounceable(char2);
				if(!check2) {
					continue;
				} else {
					password += check2;
				}

				var check3 = this.__checkForPronounceable(char3);
				if(!check3) {
					continue;
				} else {
					password += check3;
				}
			}

			password = password.substring(0, this.options.password_length);

		} else {
			var alphabet = '';

			// build alphabet to pick
			if(this.options.upper) {
				alphabet += this.options.upper_alphabet;
			}
			if(this.options.lower) {
				alphabet += this.options.lower_alphabet;
			}
			if(this.options.numbers) {
				alphabet += this.options.numbers_alphabet;
			}
			if(this.options.special) {
				alphabet += this.options.special_alphabet;
			}

			//var alphabet_length = alphabet.length;
			
			password = this.__picker(this.options.password_length, this.options.password_length, alphabet);
		} // if mask else if pronounceable else
		
		return password;
	};


	/*
	Add random number of uppercase letters between <min> and <max> or exact number if only <min> is filled
	*/
	GPG.prototype.addUpper = function(min, max) {
		var min = (typeof min != 'undefined' ? min : 0);
		var max = (typeof max != 'undefined' ? max : min);
		this.password += this.__picker(min, max, this.options.upper_alphabet);

		return this;
	};
	

	/*
	Add random number of lowercase letters between <min> and <max> or exact number if only <min> is filled
	*/
	GPG.prototype.addLower = function(min, max) {
		var min = (typeof min != 'undefined' ? min : 0);
		var max = (typeof max != 'undefined' ? max : min);
		this.password += this.__picker(min, max, this.options.lower_alphabet);

		return this;
	};

	/*
	Add random number of numbers between <min> and <max> or exact number if only <min> is filled
	*/
	GPG.prototype.addNumber = function(min, max) {
		var min = (typeof min != 'undefined' ? min : 0);
		var max = (typeof max != 'undefined' ? max : min);
		this.password += this.__picker(min, max, this.options.numbers_alphabet);

		return this;
	};

	/*
	Add random number of special characters between <min> and <max> or exact number if only <min> is filled
	*/
	GPG.prototype.addSpecial = function(min, max) {
		var min = (typeof min != 'undefined' ? min : 0);
		var max = (typeof max != 'undefined' ? max : min);
		this.password += this.__picker(min, max, this.options.special_alphabet);

		return this;
	};

	/*
	Shuffle characters in password specified times
	*/
	GPG.prototype.shuffle = function(times) {
		var times = (typeof times != 'undefined' ? times : 1);
		for(i = 0; i < times; i++) {
			this.password = shuffleString(this.password);
		}
		return this;
	}

	/*
	Clear password
	*/
	GPG.prototype.empty = function() {
		this.password = '';
		return this;
	}


	/*
	Internal function.
	Pick number (defined by min and max) of character from alphabet
	*/
	GPG.prototype.__picker = function(min, max, alphabet) {
		var password = '';
		var password_length = getRandomInt(min, max);

		for(var i = 0; i < password_length; i++) {
			var character = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
			if(this.options.use_similar) {
				password += character;
			} else {
				if(this.options.similar_alphabet.indexOf(character) == -1) {
					password += character;
				} else {
					// pick another character
					i--;
				}
			}
		} // for

		return password;
	}

	/*
	Internal function
	Check if generated character in pronounceable password is valid and randomly change it, based on options
	*/
	GPG.prototype.__checkForPronounceable = function(character) {
		if(this.options.upper && !this.options.lower) {
			// just upper characters
			character = character.toUpperCase();
			if(this.options.upper_alphabet.indexOf(character) == -1) {
				// selected character is not in upper alphabet
				return false;
			}
		} else {
			if(this.options.lower_alphabet.indexOf(character) == -1) {
				// selected character is not in lower alphabet
				return false;
			}
		}

		// random change
		var operation = getRandomInt(0, 25);
		if(operation == 7 && this.options.numbers) {
			// change to number
			var newchar = this.__picker(1, 1, this.options.numbers_alphabet);
			if(!this.options.similar) {
				while(this.options.similar_alphabet.indexOf(newchar) !== -1) {
					newchar = this.__picker(1, 1, this.options.numbers_alphabet);
				}
			}
			return newchar;
		} else if(operation == 11 && this.options.special) {
			// change to special character
			var newchar = this.__picker(1, 1, this.options.special_alphabet);
			if(!this.options.similar) {
				while(this.options.similar_alphabet.indexOf(newchar) !== -1) {
					newchar = this.__picker(1, 1, this.options.special_alphabet);
				}
			}
			return newchar;
		} else if((operation == 17 || operation == 4 || operation == 21) && this.options.upper) {
			var newchar = character.toUpperCase();
			if(!this.options.similar && this.options.similar_alphabet.indexOf(newchar) !== -1) {
				return false;
			}
			return newchar;
		}

		return character;
	}

	// private functions
	// Extends default options
	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

	// Get random integer in range
	function getRandomInt(min, max) {
		var min = (typeof min != 'undefined' ? min : 0);
		var max = (typeof max != 'undefined' ? max : min);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Shuffle string
	function shuffleString(str) {
		var a = str.split(""),
		n = a.length;

		for(var i = n - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join("");
	}

}()) // main function