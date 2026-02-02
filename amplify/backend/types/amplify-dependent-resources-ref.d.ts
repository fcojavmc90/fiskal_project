export type AmplifyDependentResourcesAttributes = {
  "api": {
    "taxmvp": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "taxmvpfe99dd4f": {
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