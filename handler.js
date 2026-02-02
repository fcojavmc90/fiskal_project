const { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider");
const client = new CognitoIdentityProviderClient({});

exports.handler = async (event) => {
    // 1. Extraemos el rol del atributo personalizado que configuramos
    const role = event.request.userAttributes['custom:role']; 
    const userPoolId = event.userPoolId;
    const userName = event.userName;

    console.log(`Asignando usuario ${userName} al grupo: ${role}`);

    if (role === 'CLIENT' || role === 'PRO') {
        try {
            const command = new AdminAddUserToGroupCommand({
                GroupName: role,
                UserPoolId: userPoolId,
                Username: userName,
            });
            await client.send(command);
            console.log("Usuario asignado con éxito");
        } catch (error) {
            console.error("Error asignando grupo:", error);
        }
    }

    // Es vital devolver el evento para que Cognito complete el registro
    return event;
};
