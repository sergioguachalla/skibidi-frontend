pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'sk-50', url: 'https://github.com/sergioguachalla/skibidi-frontend'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build -- --prod'
            }
        }
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy realizado con éxito'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build completado exitosamente'
        }
        failure {
            echo 'El build falló'
        }
    }
}
