import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_E4seqSvW8', 
  ClientId: '17s77ojvm86cv1llq9092b5pia'
};

export const userPool = new CognitoUserPool(poolData);
