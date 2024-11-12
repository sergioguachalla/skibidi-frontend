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
                script {
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'npm run build -- --prod'
                }
            }
        }
    }
    post {
        always {
            // Limpia el workspace después del build
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
