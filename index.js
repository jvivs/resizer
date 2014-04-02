var debug = require('debug');
var path = require('path');
var fs = require('fs');
var gm = require('gm');

debug('resize module!');

var resizer = function (name, source, target, size, cb) {
	var error = null;

	// TODO unsyncify fs.exists
	if (!name) {
		error = new Error('Image not provided');
	} else if (!source || !fs.existsSync(source)) {
		error = new Error('Invalid source directory');
	} else if (!target || !fs.existsSync(target)) {
		error = new Error('Invalid target directory');
	} else if (!size || !size[0] || !size[1]) {
		error = new Error('Size must be supplied');
	}

	if (error) {
		debug(error);
 	    cb(error, null);
	} else {
		debug('all\'s well that starts well');
		var readStream = fs.createReadStream(source);
		var resizedPath = path.join(target, name);

		// handle errors w/ readStream?
		gm(readStream, name)
			.resize(size[0], size[1])
			.write(resizedPath, function (err) {
				var error = err || null;
				var result = !error ? resizedPath : null;

				debug('all\'s well that ends well');
				cb(error, result);
			})
	}
};

module.exports = resizer;