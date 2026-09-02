@description('Name of the container app.')
param appName string

@description('Location for the container app.')
param location string

@description('Target environment ID.')
param environmentId string

@description('Container image URL from GHCR.')
param imageName string

@description('Port exposed by the container.')
param targetPort int

@description('Is external ingress enabled?')
param isExternalIngress bool = false

@description('Environment variables for the container.')
param envVars array = []

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: appName
  location: location
  properties: {
    managedEnvironmentId: environmentId
    configuration: {
      ingress: {
        external: isExternalIngress
        targetPort: targetPort
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: appName
          image: imageName
          env: envVars
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 2
      }
    }
  }
}

output fqdn string = containerApp.properties.configuration.ingress.fqdn