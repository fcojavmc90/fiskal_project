const fs = require('fs');
try {
    const config = JSON.parse(fs.readFileSync('./amplify_outputs.json', 'utf8'));
    console.log('✅ Configuración cargada:', config.auth.user_pool_id);
} catch (e) {
    console.error('❌ Error: amplify_outputs.json no encontrado o inválido');
}
