import { CognitoUserPool } from 'amazon-cognito-identity-js';
import awsExports from '../aws-exports';

const poolData = {
  UserPoolId: awsExports.aws_user_pools_id,
  ClientId: awsExports.aws_user_pools_web_client_id,
};

export const userPool = new CognitoUserPool(poolData);
