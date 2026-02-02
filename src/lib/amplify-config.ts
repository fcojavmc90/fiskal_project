import { Amplify } from 'aws-amplify';

const config = {
  auth: {
    user_pool_id: 'us-east-1_F1H57jRia',
    aws_region: 'us-east-1',
    user_pool_client_id: '4m51c4b7b258qf9r84b0v4v8f7',
    standard_required_attributes: ['email']
  }
};

export const initAmplify = () => {
  if (typeof window !== 'undefined') {
    Amplify.configure(config, { ssr: true });
    console.log("✅ Amplify configurado manualmente");
  }
};
