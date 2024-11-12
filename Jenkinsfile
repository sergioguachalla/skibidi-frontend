pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clonar el código desde tu repositorio
                git url: 'https://github.com/tu_usuario/tu_repositorio.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Instalar dependencias usando npm
                script {
                    // Configurar NodeJS desde el plugin para usar npm
                    def nodeHome = tool name: 'NodeJS', type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                // Compilar la aplicación Angular
                sh 'ng build --prod'
            }
        }

        stage('Test') {
            steps {
                // Ejecutar pruebas
                sh 'npm test'
            }
        }
    }

    post {
        always {
            // Limpiar espacio de trabajo después de cada ejecución
            cleanWs()
        }
    }
}
