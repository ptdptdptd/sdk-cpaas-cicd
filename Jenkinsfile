pipeline {
    agent {
        docker { image 'debian:buster' }
    }
    stages {
        stage('Test') {
      steps {
        sh 'uname -a'
      }
        }
    }
}
