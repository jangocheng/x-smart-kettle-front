def label = "mypod-${UUID.randomUUID().toString()}"
def project_name = "idmp-manage-vue"
def img_name = "idmp-manage-vue"
def img_container = "Xtlegg"
def repo_url = "registry.cn-hangzhou.aliyuncs.com";
def img_url = ""
def img_version = '${img_version}'
podTemplate(cloud: 'kubernetes',namespace: 'Xtldevops',label: label,serviceAccount:'bald-quetzal-ibm-jenkins',
    containers: [
      containerTemplate(name: 'git', image: 'xtl-docker-local.repo.inspur.com/jenkins/gitlab-runner:11', ttyEnabled: true, command: 'cat', args: ''),
      containerTemplate(name: 'yarn', image: 'xtl-docker-local.repo.inspur.com/jenkins/yarn:1.22.4', ttyEnabled: true, command: 'cat', args: ''),
      containerTemplate(name: 'docker', image: 'xtl-docker-local.repo.inspur.com/jenkins/docker-in-docker:18', ttyEnabled: true, command: 'cat', args: '')
    ],imagePullSecrets: ['artifactory-Xtl'],volumes: [
        hostPathVolume ( hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
    ])
    {
        node(label) {
            stage('git-clone') {
                container('git'){
                    sh 'git clone http://e-commerce:e-commerce%3Fa@git.inspur.com/ecbh/idmp/business/frontend/idmp-manage-vue.git && git -C ' + project_name + ' show HEAD';
                    sh 'git clone http://e-commerce:e-commerce%3Fa@git.inspur.com/ecbh/doc.git mvn-settings'
                }
            }
            stage('yarn-build') {
                container('yarn'){
                    sh 'cd ' + project_name + ' && yarn  && yarn build';
                }
            }
            stage('docker-build') {
                container('docker'){
                    sh 'docker login -u Xtlegg -p 10Passw0rd registry.cn-hangzhou.aliyuncs.com';
                    sh 'cp -r ' + project_name + '/dist ' + project_name + '/docker/prod/dist';
                    img_url = repo_url + '/'+img_container+'/' + img_name + ':' + img_version
                    sh 'cd ' + project_name + '/docker/prod && docker build -t ' + img_url + ' .'
                    sh 'docker push ' + img_url
                }
            }
        }
    }
