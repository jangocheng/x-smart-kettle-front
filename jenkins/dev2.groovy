def label = "mypod-${UUID.randomUUID().toString()}"
def project_group = "idmp"
def project_url = 'git.inspur.com/ecbh/idmp/business/frontend/'
def project_name = "idmp-manage-vue"
def img_name = "idmp-manage-vue"
def img_container = "idmp_dev"
def repo_url = "xtl-docker-local.repo.inspur.com";
def img_url = ""
def img_version = "latest"
def repoUser = 'Xtl'
def repoPassword = '123456a?'
//ssh登录远程服务器 （服务器基础环境 docker、Git、node ）
def remote = [:]
  remote.name = '10.110.34.27'
  remote.host = '10.110.34.27'
  remote.user = 'root'
  remote.password = '10Passw0rd'
  remote.allowAnyHosts = true
podTemplate(cloud: 'kubernetes',namespace: 'Xtldevops',label: label,serviceAccount:'bald-quetzal-ibm-jenkins',
    containers: [
         containerTemplate(name: 'kubectl', image: 'xtl-docker-local.repo.inspur.com/Xtl/kubectl3435:v2', ttyEnabled: true, command: 'cat', args: '')
         ],imagePullSecrets: ['artifactory-Xtl'],volumes: [
        hostPathVolume ( hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
    ])
    {
        node(label) {
            stage('ssh-deploy') {
                //删除已有目录 注意不同工程 project_name 不能重复
                sshCommand remote: remote, command: 'cd /opt/buildSpace && if [ ! -d "' + project_group + '" ];then mkdir ' + project_group + '; fi && cd ' + project_group + ' && rm -rf '+project_name;
                // git 下载工程
                sshCommand remote: remote, command: 'cd /opt/buildSpace/' + project_group + ' && git clone http://e-commerce:e-commerce%3Fa@' + project_url + project_name +  '.git';
                // node安装 并 编译
                sshCommand remote: remote, command: 'cd /opt/buildSpace/' + project_group + '/' + project_name + '  &&  rm -Rf .git  && yarn install && yarn build ';
                // 复制www 到 prod下
                sshCommand remote: remote, command:  'cd /opt/buildSpace/' + project_group + '/' + project_name +'/ && cp -r  dist  ./docker/dev/';
                //镜像名称
                img_url = repo_url + '/'+ img_container +'/' + img_name + ':' + img_version;
                //制作镜像
                sshCommand remote: remote, command: 'cd  /opt/buildSpace/' + project_group + '/' + project_name +'/docker/dev   && docker build -t ' + img_url + ' .';
                // 上传镜像
                sshCommand remote: remote, command: 'docker login -u='+repoUser+' -p='+ repoPassword + ' ' + repo_url +' && docker push ' + img_url;
                //删除已有目录
                sshCommand remote: remote, command: 'cd /opt/buildSpace/' + project_group + ' &&  rm -rf '+project_name;
            }
            stage('kubectl-deploy') {
                container('kubectl') {
                    sh 'kubectl rollout restart  deployment/idmp-manage-vue -n 1011034113';
                }
            }
        }
    }
