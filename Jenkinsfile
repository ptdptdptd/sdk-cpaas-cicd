pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                sh 'pm2 list'
            }
        }
    }
}