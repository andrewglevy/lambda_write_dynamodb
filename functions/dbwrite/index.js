console.log('starting function');

const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const Ajv = require('ajv');

exports.handle = function(e, ctx, cb) {
  const ajv = new Ajv();
  const schema = {
    "$id": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "name": "string",
      "score": "integer"
    }
  };
  const validate = ajv.compile(schema);



  var params = {
    Movie: {
      ID: uuidv4(),
      name: e.movieName,
      score: e.movieScore
    },
    TableName: 'movies'
  };
  const valid = validate(params);
  if (!valid) console.log(validate.errors);
  docClient.put(params, function(err, data){
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    };
  });
};
