/* Amplify override: allow group roles to upload survey files via bucket policy. */
module.exports = function override(resources) {
  if (!resources || !resources.S3Bucket) {
    throw new Error('Expected S3Bucket in storage resources.');
  }

  const bucketArn = {
    'Fn::Join': ['', ['arn:aws:s3:::', { Ref: 'S3Bucket' }]],
  };

  resources.S3BucketPolicy = {
    Type: 'AWS::S3::BucketPolicy',
    Properties: {
      Bucket: { Ref: 'S3Bucket' },
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowGroupRoleSurveyUploads',
            Effect: 'Allow',
            Principal: {
              AWS: [
                { 'Fn::Sub': 'arn:aws:iam::${AWS::AccountId}:role/*CLIENTGroupRole' },
                { 'Fn::Sub': 'arn:aws:iam::${AWS::AccountId}:role/*PROGroupRole' },
              ],
            },
            Action: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    bucketArn,
                    '/protected/*/survey/*',
                  ],
                ],
              },
            ],
          },
        ],
      },
    },
  };
};
