from fabric.api import task, run, local

VERSION = '1.6.1'
CONTAINER_NAME = 'meuml_app_web'
IMAGE_NAME = 'meuml/%s' % CONTAINER_NAME

@task
def build():
    local('docker build -t %s:%s --rm .' % (IMAGE_NAME, VERSION))
    local('docker tag %s:%s %s:latest' % (IMAGE_NAME, VERSION, IMAGE_NAME))


@task
def push():
    build()

    # Cria uma tag de backup para facilmente voltar o backup
    local('git push --all')
    local('git push --tags')

    local('docker pull docker.gorillascode.com/%s:latest' % (IMAGE_NAME))
    local('docker tag docker.gorillascode.com/%s:latest docker.gorillascode.com/%s:backup' % (IMAGE_NAME, IMAGE_NAME))
    local('docker tag %s:%s docker.gorillascode.com/%s:%s' % (IMAGE_NAME, VERSION, IMAGE_NAME, VERSION))
    local('docker tag %s:%s docker.gorillascode.com/%s:latest' % (IMAGE_NAME, VERSION, IMAGE_NAME))
    local('docker push docker.gorillascode.com/%s:backup' % IMAGE_NAME)
    local('docker push docker.gorillascode.com/%s:%s' % (IMAGE_NAME, VERSION))
    local('docker push docker.gorillascode.com/%s:latest' % IMAGE_NAME)