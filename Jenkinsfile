pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
      steps {
        sh 'pm2 start ecosystem.config.js'
        sh 'pm2 log'
      }
        }
    }
} 