@description('Location for all resources.')
param location string

@description('Container App name.')
param appName string

@description('Container Apps Environment ID.')
param environmentId string

@description('Container image URL.')
param containerImage string

@description('Target port for ingress.')
param targetPort int

@description('Environment variables for the container.')
param envVars array = []

@description('Registry password (e.g. GITHUB_TOKEN).')
@secure()
param registryPassword string = ''

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: appName
  location: location
  properties: {
    managedEnvironmentId: environmentId
    configuration: {
      ingress: {
        external: true
        targetPort: targetPort
        transport: 'auto'
      }
      registries: empty(registryPassword) ? [] : [
        {
          server: 'ghcr.io'
          username: 'mission-ready'
          passwordSecretRef: 'ghcr-password'
        }
      ]
      secrets: empty(registryPassword) ? [] : [
        {
          name: 'ghcr-password'
          value: registryPassword
        }
      ]
    }
    template: {
      containers: [
        {
          name: appName
          image: containerImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: envVars
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
      }
    }
  }
}

output fqdn string = containerApp.properties.configuration.ingress.fqdn