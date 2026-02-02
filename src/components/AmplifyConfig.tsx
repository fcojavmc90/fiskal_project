'use client';
import { Amplify } from 'aws-amplify';

export function initAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_yEsaEcYp9',
        userPoolClientId: '7gqnjuj6gfm30bcc5jqv66ref'
      }
    }
  }, { ssr: true });
}

export default function AmplifyConfigComponent() {
  initAmplify();
  return null;
}

export const SQUARE_CONFIG = {
  applicationId: 'sandbox-sq0idb-sAZAB6UZJp_OK3EYI4twyA',
  locationId: 'LRP7MT91QBTDP'
};
