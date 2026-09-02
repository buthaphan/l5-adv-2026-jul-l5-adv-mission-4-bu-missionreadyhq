@description('Primary location for all deployed resources.')
param location string = resourceGroup().location

@description('Prefix used for naming environment resources.')
param appName string = 'tina'

@description('Image tag (commit SHA or latest).')
param imageTag string = 'latest'

@description('GitHub repository owner in lowercase (e.g. mission-ready).')
param repoOwner string

module environment 'environment.bicep' = {
  name: 'container-app-environment'
  params: {
    location: location
    environmentName: '${appName}-assistant-env'
  }
}

module backend 'container-app.bicep' = {
  name: 'backend-app'
  params: {
    appName: '${appName}-backend'
    location: location
    environmentId: environment.outputs.environmentId
    imageName: 'ghcr.io/${repoOwner}/tina-backend:${imageTag}'
    targetPort: 3000
    isExternalIngress: true
  }
}

module frontend 'container-app.bicep' = {
  name: 'frontend-app'
  params: {
    appName: '${appName}-frontend'
    location: location
    environmentId: environment.outputs.environmentId
    imageName: 'ghcr.io/${repoOwner}/tina-frontend:${imageTag}'
    targetPort: 80
    isExternalIngress: true
    envVars: [
      {
        name: 'VITE_API_ENDPOINT'
        value: 'https://${backend.outputs.fqdn}'
      }
    ]
  }
}

output frontendUrl string = 'https://${frontend.outputs.fqdn}'
output backendUrl string = 'https://${backend.outputs.fqdn}'