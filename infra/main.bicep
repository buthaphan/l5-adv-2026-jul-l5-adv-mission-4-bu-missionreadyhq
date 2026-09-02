@description('Primary location for all deployed resources.')
param location string = resourceGroup().location

@description('Prefix used for naming environment resources.')
param appName string = 'tina-assistant'

@description('Tag/SHA for the container images.')
param imageTag string = 'latest'

@description('GitHub repository owner or organization.')
param repoOwner string = 'mission-ready'

@description('Registry password for GHCR access.')
@secure()
param registryPassword string = ''

module environment 'environment.bicep' = {
  name: 'container-app-environment'
  params: {
    location: location
    environmentName: '${appName}-env'
  }
}

module backendApp 'container-app.bicep' = {
  name: 'backend-app'
  params: {
    location: location
    appName: 'tina-backend'
    environmentId: environment.outputs.environmentId
    containerImage: 'ghcr.io/${toLower(repoOwner)}/tina-backend:${imageTag}'
    targetPort: 3000
    registryPassword: registryPassword
  }
}

module frontendApp 'container-app.bicep' = {
  name: 'frontend-app'
  params: {
    location: location
    appName: 'tina-frontend'
    environmentId: environment.outputs.environmentId
    containerImage: 'ghcr.io/${toLower(repoOwner)}/tina-frontend:${imageTag}'
    targetPort: 80
    registryPassword: registryPassword
    envVars: [
      {
        name: 'VITE_API_ENDPOINT'
        value: 'https://${backendApp.outputs.fqdn}'
      }
    ]
  }
}

output backendUrl string = 'https://${backendApp.outputs.fqdn}'
output frontendUrl string = 'https://${frontendApp.outputs.fqdn}'