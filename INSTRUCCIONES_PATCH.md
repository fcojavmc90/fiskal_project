FISKAL – Encuesta → Recomendados + Onboarding PRO

Instalación:
cd ~/tax-mvp
unzip fiskal_recommendations_and_pro_onboarding.zip -d /tmp/fiskal_patch
cp -rf /tmp/fiskal_patch/src ./src
npm run dev

Rutas:
CLIENT: /survey → /professionals/recommended
PRO: /pro/onboarding
