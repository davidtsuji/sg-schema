var schema = require('sg-schema');

cast = require('sg-cast');
isEmpty = require('sg-is-empty');

test('schema test 1', function(){

	var aSchema = {

	 	name : { _type : String, _default : 'David' },
	 	age : Number,
	 	dob1 : Date,
	 	dob2 : Date,
	 	dob3 : 'Moment',
	 	dob4 : { _type : 'Moment', _dateFormat : 'DD MMM YYYY h:mm A' },
	 	dob5 : 'Moment',
	 	address : {

	 		street : { _type : String, _default : '' },
	 		postcode : { _type : Number, _default : '' },

	 		work : {

	 			country : String,

	 		}

	 	},

	 	favouriteColor1 : { _type : String, _values : [ 'red', 'green', 'blue' ] },
	 	favouriteColor2 : { _type : String, _values : [ 'red', 'green', 'blue' ], _default : 'orange' },
	 	favouriteColor3 : { _type : String, _values : [], _default : 'orange' },

	 	favouriteNumber1 : { _type : Number, _values : [ 1,2,3 ] },
	 	favouriteNumber2 : { _type : Number, _values : [ 1,2,3 ] },
	 	favouriteNumber3 : { _type : Number, _values : [ 1,2,3 ] },

	 	likesPorkBelly1 : { _type : Boolean, _values : [ true ] },
	 	likesPorkBelly2 : { _type : Boolean, _values : [ true ] },
	 	likesPorkBelly3 : { _type : Boolean, _values : [ true ] },

	 	freeTypeValue1 : '*',
	 	freeTypeValue2 : { _type: '*'},
	 	freeTypeValue3 : { _type: '*'},
	 	freeTypeValue4 : { _type: '*', _default : 'aqua'},
	 	freeTypeValue5 : { _type: '*', _values : [ 'pink', 'blue' ]},
	 	freeTypeValue6 : '*',

	}

	var anObject = {

		age : 33,

		dob1 : '19 Oct 1980',
		dob2 : new Date(),
		dob3 : '50 april 2020',
		dob4 : '27 Feb 2011 17:30:10',
		dob5 : 476590380000,

		address : {

			street : '1 smith street',
			postcode : '4000',

			work : {

				badKey : 'this should not exist',

			}

		},

		favouriteColor1 : 'black',
		favouriteColor2 : 'black',
		favouriteColor3 : null,
		
		favouriteNumber1 : 3,
		favouriteNumber2 : 4,
		favouriteNumber3 : '3',

		likesPorkBelly1 : false,
		likesPorkBelly2 : 'false',
		likesPorkBelly3 : null,

		freeTypeValue1 : 'free value 1',
		freeTypeValue2 : true,
		freeTypeValue3 : { a: 'a', b:{ c: 'c'}},
		freeTypeValue5 : '',

	};

	var anObjectWithaSchemaApplied = schema.apply(aSchema, anObject);

	// console.log(anObjectWithaSchemaApplied);

	ok( anObjectWithaSchemaApplied.name === 'David' );
	ok( anObjectWithaSchemaApplied.age === 33, 'age should equal 33' );
	ok( anObjectWithaSchemaApplied.dob1.getTime() === 340725600000, 'dob should equal 340725600000' );
	ok( anObjectWithaSchemaApplied.dob2.toGMTString() === new Date().toGMTString(), 'dob should equal the current GMT String' );
	ok( anObjectWithaSchemaApplied.dob3.isValid() === false, 'dob is a moment object and is valid' );
	ok( anObjectWithaSchemaApplied.dob4 === '27 Feb 2011 5:30 PM', 'dob should equal 27 Feb 2011 5:30 PM' );
	ok( anObjectWithaSchemaApplied.dob5.format('D MMMM YYYY h:mm A') === '7 February 1985 12:13 PM', 'dob should equal 7 February 1985 12:13 PM' );
	ok( anObjectWithaSchemaApplied.address.constructor === Object, 'address constructor equals an Object' );
	ok( anObjectWithaSchemaApplied.address.street === '1 smith street', 'address.street equals a "1 smith street"' );
	ok( anObjectWithaSchemaApplied.address.postcode === 4000, 'address.postcode equals 4000' );
	ok( anObjectWithaSchemaApplied.address.work.constructor === Object, 'address.work constructor equals an Object' );
	ok( anObjectWithaSchemaApplied.address.work.hasOwnProperty('badKey') === false, 'address.work does not contain a key "badKey"' );
	ok( anObjectWithaSchemaApplied.address.work.country === '', 'country is an empty string' );
	ok( JSON.stringify(anObjectWithaSchemaApplied.address) === '{"street":"1 smith street","postcode":4000,"work":{"country":""}}', 'address stringified' );
	ok( anObjectWithaSchemaApplied.favouriteColor1 === 'red', 'bad value so use the first value' );
	ok( anObjectWithaSchemaApplied.favouriteColor2 === 'red', 'bad value but use the values instead of the default' );
	ok( anObjectWithaSchemaApplied.favouriteColor3 === 'orange', 'bad value and no values so use the default' );

	ok( anObjectWithaSchemaApplied.favouriteNumber1 === 3, 'more default value tests');
	ok( anObjectWithaSchemaApplied.favouriteNumber2 === 1, 'more default value tests');
	ok( anObjectWithaSchemaApplied.favouriteNumber3 === 3, 'more default value tests');

	ok( anObjectWithaSchemaApplied.likesPorkBelly1 === true, 'more default value tests');
	ok( anObjectWithaSchemaApplied.likesPorkBelly2 === true, 'more default value tests');
	ok( anObjectWithaSchemaApplied.likesPorkBelly3 === true, 'more default value tests');

	ok( anObjectWithaSchemaApplied.freeTypeValue1 === 'free value 1', 'free type test 1');
	ok( anObjectWithaSchemaApplied.freeTypeValue2 === true, 'free type test 2');
	ok( JSON.stringify(anObjectWithaSchemaApplied.freeTypeValue3) === '{"a":"a","b":{"c":"c"}}', 'free type test 3');
	ok( anObjectWithaSchemaApplied.freeTypeValue4 === 'aqua', 'free type test 4');
	ok( anObjectWithaSchemaApplied.freeTypeValue5 === 'pink', 'free type test 5');
	ok( anObjectWithaSchemaApplied.freeTypeValue6 === '', 'free type test 6');

});


test('schema test 2', function(){

	var aSchema = {

		name : String,
		ismale : { _type : Boolean, _default : true, _optional : true },
		ispolitical : { _type : Boolean, _default : true, _optional : true },
		age : { _type : Number },
		height : Number,

		address : {

			street : { _type : String, _default : '1 smith st' },
			postcode : { _type : Number, _default : 4000, _optional : true },

			work : {

				suburb : String,
				somearray : { _type : Array, _values : [[1],[2],[3]] },
				emptyobject : { _type : Object, _values : [{a:'a'}, {b:'b'}] }

			}

		}

	}

	var anObject = {

		name : 'Max',
		ismale : true,

	}

	var anObjectWithaSchemaApplied = schema.apply(aSchema, anObject);

	ok( JSON.stringify(anObjectWithaSchemaApplied) == '{"name":"Max","ismale":true,"age":0,"height":0,"address":{"street":"1 smith st","work":{"suburb":"","somearray":[1],"emptyobject":{"a":"a"}}}}' )

});

test('schema test 3', function(){

	var aSchema = {

		name : String,
		qualifications : {

			certificate : String,
			year: Number

		},
		isAlive : { _type : Boolean },

	}

	var anObjectWithaSchemaApplied = schema.apply(aSchema, { isAlive : true });

	// console.log(anObjectWithaSchemaApplied);

	ok( anObjectWithaSchemaApplied.name === '', 'name should be an empty string')
	ok( anObjectWithaSchemaApplied.qualifications.certificate === '', 'certificate should be an empty string')
	ok( anObjectWithaSchemaApplied.isAlive === true, 'isAlive should be true')

});

test('schema test with auto defaults off', function() {

	var aSchema = {

		name : String,
		ismale : { _type : Boolean, _default : true, _optional : true },
		ispolitical : { _type : Boolean, _default : true, _optional : true },
		age : { _type : Number },
		height : Number,

		address : {

			street : { _type : String, _default : '1 smith st' },
			postcode : { _type : Number, _default : 4000, _optional : true },

			work : {

				suburb : String,
				somearray : { _type : Array, _values : [[1],[2],[3]] },
				emptyobject : { _type : Object, _values : [{a:'a'}, {b:'b'}] }

			}

		}

	}

	var anObject = {

		name : 'Max',
		ismaleBadKey : true,

	}

	var anObjectWithaSchemaApplied = schema.apply(aSchema, anObject, true);

	ok( JSON.stringify(anObjectWithaSchemaApplied) == '{"name":"Max","address":{"street":"1 smith st","work":{"somearray":[1],"emptyobject":{"a":"a"}}}}' );

});

test('an empty schema returns the data', function() {

	ok( JSON.stringify(schema.apply({}, { a: 'a', b: { c: 'c' } })) == '{"a":"a","b":{"c":"c"}}' );

});