pipeline {
  environment {
    dockerimagename = 'cs31cs31/cpaas-application'
    dockerImage = ''
  }

  agent any

  stages {
    stage('Checkout Source') {
      steps {
        git 'https://github.com/ptd-31/cpaas-application.git'
      }
    }

    stage('Build image') {
      environment {
        DOCKER_TAG = "${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0, 7)}"
      }
      steps {
        script {
          dockerImage = docker.build dockerimagename:${ DOCKER_TAG }
        }
      }
    }

    stage('Pushing Image') {
      environment {
        registryCredential = 'dockerhublogin'
      }
      steps {
        script {
          docker.withRegistry('https://registry.hub.docker.com', registryCredential) {
            dockerImage.push('latest')
          }
        }
      }
    }

  // stage('Deploying App to Kubernetes') {
  //   steps {
  //     script {
  //       kubernetesDeploy(configs: "deploymentservice.yml", kubeconfigId: "kubernetes")
  //     }
  //   }
  // }
  }
}
