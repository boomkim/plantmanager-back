const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

	var token = req.headers['Authorization'];
	token = token.split(' ')[-1];
	if ( !token ) {
		return res.status(403).json({
			success : false,
			message : 'Login first'
		});
	}

	const promise = new Promise( (resolve, reject) => {
		jwt.verify(
			token,
			req.app.get('jwt-secret'),
			(err, decoded) => {
				if ( err ) reject(err);
				resolve(decoded);
			}
		);
	});

	const onError = (error) => {
		res.status(403).json({
			success : false,
			message : error.message
		});
	};

	promise
	.then( (decoded) => {
		req.decoded = decoded; // 디코드된 데이터를 req 에 담는다.
		next(); // 실제 라우터 단 로직을 수행하기 위해 next()
	})
	.catch(onError);
};

module.exports = authMiddleware;