# /bin/sh


helm repo add conduktor https://helm.conduktor.io
helm repo update

export ADMIN_EMAIL="admin@admin.com"
export ADMIN_PASSWORD="admin"
export ORG_NAME="ddp"
export NAMESPACE="ddp-kafka-cluster"

# Deploy helm chart
helm install console conduktor/console \
  --create-namespace -n ${NAMESPACE} \
  --set config.organization.name="${ORG_NAME}" \
  --set config.admin.email="${ADMIN_EMAIL}" \
  --set config.admin.password="${ADMIN_PASSWORD}" \
  --set config.database.password="<your_postgres_password>" \
  --set config.database.username="<your_postgres_user>" \
  --set config.database.host="<your_postgres_host>" \
  --set config.database.port="5432" \
  --set config.license="${LICENSE}" # can be omitted if deploying the free tier
    
# Port forward to access Conduktor
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
open http://localhost:8080