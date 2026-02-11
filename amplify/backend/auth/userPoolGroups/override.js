/* Amplify override: add S3 access policies to group roles for protected/private prefixes. */
function override(resources) {
  if (!resources || !resources.CLIENTGroupRole || !resources.PROGroupRole) {
    throw new Error('Expected CLIENTGroupRole and PROGroupRole in userPoolGroups resources.');
  }

  const bucketArn = 'arn:aws:s3:::fiskal-documents-private*';
  const protectedPrefix = 'arn:aws:s3:::fiskal-documents-private*/protected/${cognito-identity.amazonaws.com:sub}/*';
  const privatePrefix = 'arn:aws:s3:::fiskal-documents-private*/private/${cognito-identity.amazonaws.com:sub}/*';
  // Allow survey uploads regardless of owner path shape (Amplify prepends protected/{identityId}/).
  const protectedSurveyPrefix = 'arn:aws:s3:::fiskal-documents-private*/protected/*/survey/*';

  const s3Policy = {
    PolicyName: 'GroupS3Access',
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
          Resource: [protectedPrefix, privatePrefix, protectedSurveyPrefix],
        },
        {
          Effect: 'Allow',
          Action: 's3:ListBucket',
          Resource: bucketArn,
          Condition: {
            StringLike: {
              's3:prefix': [
                'protected/',
                'protected/*',
                'protected/*/survey/',
                'protected/*/survey/*',
                'private/${cognito-identity.amazonaws.com:sub}/',
                'private/${cognito-identity.amazonaws.com:sub}/*',
              ],
            },
          },
        },
      ],
    },
  };

  const addPolicy = (role) => {
    const existing = role.Properties?.Policies || [];
    role.Properties = role.Properties || {};
    role.Properties.Policies = [...existing, s3Policy];
  };

  addPolicy(resources.CLIENTGroupRole);
  addPolicy(resources.PROGroupRole);
}

module.exports = override;
module.exports.override = override;
