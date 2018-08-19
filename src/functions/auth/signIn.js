import jwt from 'jsonwebtoken';

export default (event, context, callback) => {
  callback(null, {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(
      jwt.sign({ data: 'userid' }, 'secret', { expiresIn: '24h' })
    ),
  });
};
