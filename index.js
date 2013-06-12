var _ = require('underscore')
  , $ = require('jquery')

require('sgCast');

window.sg = window['sg'] || {};

window.sg.schema = {

	getSchemaProperties : function(_properties) {

		var $this = this
		  , properties

		properties               = typeof(_properties) == 'object' ? _properties : /function|string/i.test(typeof(_properties)) ? { _type : _properties } : {};
		properties._type         = _.has(properties, '_type') ? properties._type : Object;
		properties._optional     = sg.cast(properties['_optional'], Boolean, false);
		properties._default      = properties['_default'];
		properties._values       = sg.cast(properties['_values'], Array, []);
		properties._typeAsString = typeof(properties._type) == 'string' ? properties._type : sg.cast(properties._type, String, '').match(/^function ([^\(]*)\(\)/)[1];
		properties._typeDefault  = $this.defaults[properties._typeAsString];

		return properties;

	},

	parseResult : function(_result, _data, _disableAutoDefauts) {

		var $this = this
		  , properties
		  , objectData
		  , defaultData
		  , dataIsEmpty

		_.each(_result, function(_properties, _key) {

			properties = $this.getSchemaProperties(_properties);

			objectData  = {};
			defaultData = ! _.isUndefined(properties._default) || _disableAutoDefauts ? properties._default : properties._typeDefault;
			dataIsEmpty = _data[_key];

			_.each(_.keys(properties), function(_key){

				if (/^[^_]/.test(_key)) objectData[_key] = properties[_key];

			});

			if (properties._optional == false || (properties._optional == true && ! _.isUndefined(_data[_key]))) {

				_result[_key] = _.isEmpty(objectData)
				              ? sg.cast(_data[_key], properties._type, defaultData, properties._values, properties)
				              : $this.parseResult(objectData, sg.cast(_data[_key], Object, {}), defaultData, _disableAutoDefauts, properties);

			} else {

				delete _result[_key];

			}

		});

		return _result;

	},

	apply : function(_schema, _data, _disableAutoDefauts) {

		var $this  = this
		  , schema = $.extend(true, {}, _schema || {})
		  , data   = $.extend(true, {}, _data || {})

		return _.isEmpty(schema) ? _data : $this.parseResult(schema, data, _disableAutoDefauts);

	}

}

window.sg.schema.defaults = {

	'Array'   : [],
	'Boolean' : false,
	'Date'    : new Date(),
	'Moment'  : window['moment'] ? moment() : new Date(),
	'Number'  : 0,
	'Object'  : {},
	'String'  : '',

}