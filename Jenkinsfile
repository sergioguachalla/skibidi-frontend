pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {

                git url: 'https://github.com/sergioguachalla/skibidi-frontend', branch: 'sk-50'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    def nodeHome = tool name: 'NodeJS', type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'ng build --prod'
            }
        }

    }

    post {
        always {
            cleanWs()
        }
    }
}
