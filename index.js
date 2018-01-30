console.log('starting function');

const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const Ajv = require('ajv');
const ajv = new Ajv();
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

exports.handler = function(e, ctx, cb) {

  const schema = {
    "properties": {
      "ID": { "type": "string" },
      "movieName": { "type": "string" },
      "movieScore": { "type": "integer" }
    },
  };
  const validate = ajv.compile(schema);
  console.log(validate)

  var params = {
    Item: {
      ID: uuidv4(),
      name: e.movieName,
      score: e.movieScore,
    },
    TableName: 'movies'
  };

  const valid = validate(e);
  console.log('valid: ' + valid)
  if (!valid) {
    console.log(validate.errors);
  } else {
    docClient.put(params, function(err, data){
      if (err) {
        cb(err, null);
      } else {
        cb(null, data);
      };
    });
  };
};
