﻿///////////////////////////////////////////////////////////////////////////////
// Guid

var ss_Guid = ss.Guid = ss.mkType(ss, 'ss.Guid',
	function#? DEBUG Guid$##() {
	},
	null,
	{
		$valid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/ig,
		$split: /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
		empty: '00000000-0000-0000-0000-000000000000',
		$rng: new ss_Random(),
		isInstanceOfType: function#? DEBUG Guid$isInstanceOfType##(instance) {
			return typeof(instance) === 'string' && instance.match(ss_Guid.$valid);
		},
		createInstance: function#? DEBUG Guid$createInstance##() {
			return ss_Guid.empty;
		},
		parse: function#? DEBUG Guid$parse##(uuid, format) {
			var r = {};
			if (ss_Guid.tryParse(uuid, format, r))
				return r.$;
			throw new ss_FormatException('Unable to parse UUID');
		},
		tryParse: function#? DEBUG Guid$tryParse##(uuid, format, r) {
			r.$ = ss_Guid.empty;
			if (!ss.isValue(uuid)) throw new ss_ArgumentNullException('uuid');
			if (!format) {
				var m = /^[{(]?([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})[)}]?$/ig.exec(uuid);
				if (m) {
					r.$ = m.slice(1).join('-').toLowerCase();
					return true;
				}
			}
			else {
				if (format === 'N') {
					var m = ss_Guid.$split.exec(uuid);
					if (!m)
						return false;
					uuid = m.slice(1).join('-');
				}
				else if (format === 'B' || format === 'P') {
					var b = format === 'B';
					if (uuid[0] !== (b ? '{' : '(') || uuid[uuid.length - 1] !== (b ? '}' : ')'))
						return false;
					uuid = uuid.substr(1, uuid.length - 2);
				}
				if (uuid.match(ss_Guid.$valid)) {
					r.$ = uuid.toLowerCase();
					return true;
				}
			}
			return false;
		},
		format: function#? DEBUG Guid$format##(uuid, format) {
			switch (format) {
				case 'N': return uuid.replace(/-/g, '');
				case 'B': return '{' + uuid + '}';
				case 'P': return '(' + uuid + ')';
				default : return uuid;
			}
		},
		fromBytes: function#? DEBUG Guid$fromBytes##(b) {
			if (!b || b.length !== 16)
				throw new ss_ArgumentException('b', 'Must be 16 bytes');
			var s = b.map(function(x) { return ss.formatNumber(x & 0xff, 'x2'); }).join('');
			return ss_Guid.$split.exec(s).slice(1).join('-');
		},
		newGuid: function#? DEBUG Guid$newGuid##() {
			var a = Array(16);
			ss_Guid.$rng.nextBytes(a);
			a[6] = a[6] & 0x0f | 0x40;
			a[8] = a[8] & 0xbf | 0x80;
			return ss_Guid.fromBytes(a);
		},
		getBytes: function#? DEBUG Guid$getBytes##(uuid) {
			var a = Array(16);
			var s = uuid.replace(/-/g, '');
			for (var i = 0; i < 16; i++) {
				a[i] = parseInt(s.substr(i * 2, 2), 16);
			}
			return a;
		}
	}
);

ss.initStruct(ss_Guid, [ ss_IEquatable, ss_IComparable ]);
