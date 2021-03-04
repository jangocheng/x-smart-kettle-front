def label = "mypod-${UUID.randomUUID().toString()}"
def project_url = 'git.inspur.com/ecbh/x1/x1-frontend/'
def project_name = "idmp-manage-vue"
def img_name = "idmp-manage-vue"
def repo_url = "registry.cn-hangzhou.aliyuncs.com";
def img_url = ""
def img_version = "${img_version}"
def repoUser = 'Xtlegg'
def repoPassword = '10Passw0rd'
podTemplate(cloud: 'kubernetes',namespace: 'Xtldevops',label: label,serviceAccount:'bald-quetzal-ibm-jenkins',
    containers: [     ],imagePullSecrets: ['artifactory-Xtl'],volumes: [
        hostPathVolume ( hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
    ])
    {
        node(label) {
        //ssh登录远程服务器 （服务器基础环境 docker、Git、node ）
           def remote = [:]
            remote.name = '10.110.34.27'
            remote.host = '10.110.34.27'
            remote.user = 'root'
            remote.password = '10Passw0rd'
            remote.allowAnyHosts = true
            stage('ssh-deploy') {
                //删除已有目录 注意不同工程 project_name 不能重复
                sshCommand remote: remote, command: 'cd /opt/buildSpace && if [ ! -d "x1" ];then mkdir x1; fi && cd x1 && rm -rf '+project_name;
                // git 下载工程
                sshCommand remote: remote, command: 'cd /opt/buildSpace/x1 && git clone http://e-commerce:e-commerce%3Fa@' + project_url + project_name +  '.git';
                // node安装 并 编译
                sshCommand remote: remote, command: 'cd /opt/buildSpace/x1/' + project_name + '  &&  rm -Rf .git  && npm install  --unsafe-perm && npm run build  --unsafe-perm ';
                // 复制www 到 prod下
                sshCommand remote: remote, command:  'cd /opt/buildSpace/x1/' + project_name +'/ && cp -r  dist  ./docker/prod/';
                //镜像名称
                img_url = repo_url + '/Xtlegg/' + img_name + ':' + img_version;
                //制作镜像
                sshCommand remote: remote, command: 'cd  /opt/buildSpace/x1/' + project_name +'/docker/prod   && docker build -t ' + img_url + ' .';
                // 上传镜像
                sshCommand remote: remote, command: 'docker login -u='+repoUser+' -p='+ repoPassword + ' ' + repo_url +' && docker push ' + img_url;
                //删除已有目录
                sshCommand remote: remote, command: 'cd /opt/buildSpace/x1 &&  rm -rf '+project_name;
            }
        }
    }
