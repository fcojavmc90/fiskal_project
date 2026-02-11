export type AmplifyDependentResourcesAttributes = {
  "api": {
    "taxmvp": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "taxmvpd8e247c7d8e247c7": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    },
    "userPoolGroups": {
      "CLIENTGroupRole": "string",
      "PROGroupRole": "string"
    }
  },
  "function": {
    "taxmvpd8e247c7d8e247c7PostConfirmation": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "taxmvpfe99dd4fPostConfirmation": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "fiskaldocuments": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}