import mongoose from 'mongoose';

export function connectDatabase(url) {
	console.log('Connecting to %s', url);
	return new Promise((resolve, reject) => {
		mongoose.connection
		.on('error', error => reject(error))
		.on('close', () => console.log('Database connection closed.'))
		.once('open', () => resolve(mongoose.connection[0]))

		mongoose.connect(url)
	});
}


export function closeConnections() {
    return new Promise((resolve, reject) => {
        mongoose.disconnect((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}