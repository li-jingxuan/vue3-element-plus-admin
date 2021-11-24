#!/bin/bash

# deploy parameters from shell
scope=${1}
env=${2}
source_branch=${3}
is_debug=${4}
service_id=${5}
version_tag=${6}

# global settings for deployment on huawei cloud cce
_CCE_IMAGE_REGISTRY=`cat .cce-image-registry-$scope`
_CCE_IMAGE_ORG=`cat .cce-image-org-$scope`

_CCE_REPOSITORY=$_CCE_IMAGE_REGISTRY"/"$_CCE_IMAGE_ORG
_DACTYLOGRAM_API="http://159.138.82.57:5000/dactylogram"
_PODS_REPLICAS=1

checkHash() {
    path="$1"
    service="$2"
    version="$3"
    echo "Get the old hash of [$service] service ..."
    get_hash_result=`curl -s $_DACTYLOGRAM_API/$env/$service`
    echo $get_hash_result

    if [ "${#get_hash_result}" -eq 40 ]; then
        echo "Old hash"
        echo $get_hash_result
        new_hash=`tar -cO --mtime=0 --owner=gitlab-runner:0 --group=gitlab-runner:0 --sort=name --no-xattrs --exclude="*.pyc" $path | shasum | awk '{print $1}' | sed -e 's/^[ \t]*//g' | sed -e 's/[ \t]*$//g'`
        echo "New hash"
        echo $new_hash
        if [ "$get_hash_result" != "$new_hash" ]; then
            return 0
        else
            echo "Old hash = New hash"
            return 1
        fi
    else
        return 0       # 2
    fi
}

deployService() {
    path="$1"
    m="$2"
    version_tag="$3"

    if [ -f "$path/Dockerfile" ] && [ -f "$path/package.json" ] && [ -f "$path/$m.yaml" ]; then
        echo ">>>>>>>>>>>>>>>"
        version=`grep '"version"' package.json | cut -d '"' -f 4`
        if test "$version_tag" != ""; then
            version=$version'-'$version_tag
        fi

        checkHash $path $m $version
        local ret=$?
        echo "Check hash return $ret ..."
        if [ $ret -eq 0 ]; then
            echo "[$m] Service hash have changed ..."
            echo "[$m] Service new version: $version, building start ..."
            sed 's/{{{build-mode}}}/build-'$env'/g' $path/Dockerfile \
                | docker build -t dna/$env-$m:$version -t dna/$env-$m:latest . -f -
            docker tag dna/$env-$m:$version $_CCE_REPOSITORY/$env-$m:$version
            docker tag dna/$env-$m:$version $_CCE_REPOSITORY/$env-$m:latest
            docker push $_CCE_REPOSITORY/$env-$m:$version
            docker push $_CCE_REPOSITORY/$env-$m:latest
            docker rmi dna/$env-$m:$version
            docker rmi dna/$env-$m:latest
            docker rmi $_CCE_REPOSITORY/$env-$m:latest
            docker rmi $_CCE_REPOSITORY/$env-$m:$version
            if [ $? -eq 0 ]; then
                echo "Begin to deploy service [$m] into k8s cluster ... "
                cat ./$path/$m.yaml | sed s/{{{version}}}/$version/g \
                    | sed s/{{{env}}}/$env/g \
                    | sed s/{{{debug}}}/$is_debug/g \
                    | sed s/{{{rep}}}/$_PODS_REPLICAS/g \
                    | sed s/{{{registry}}}/$_CCE_IMAGE_REGISTRY/g \
                    | sed s/{{{organization}}}/$_CCE_IMAGE_ORG/g \
                    | kubectl apply -f -

                if [ $? -eq 0 ]; then
                    echo "Updating [$m] service dactylogram hash ..."
                    post_hash_ret=`curl -s $_DACTYLOGRAM_API/$env/$m -d "value=$new_hash"`
                    echo $post_hash_ret
                    #post_code = `echo $post_hash_ret | sed -n '1p' | awk '{print $2}'`
                else
                    echo "Deploy [$m] service failed."
                fi
            else
               echo "[$m] Service building docker image failed."
            fi

        elif [ $ret -eq 1 ]; then
            echo "[$m] service is on the latest version: $version."
        else
            echo "Cann't get [$m] service old hash ..."
        fi
    fi
}

if [ "$env" = "" ] || [ "$source_branch" = "" ] || [ "$is_debug" = "" ] || [ "$service_id" = "" ]; then
    echo "---------------------------------------"
    echo "  PerFee K8S Deploy Command Line Util"
    echo "---------------------------------------"
    echo "Usage:"
    echo "    docker-auto-cce.sh [env] [source_branch] [is_debug] [service_id: all is default] [version_tag: optional]"
    echo ""
    echo "Examples:"
    echo "    docker-auto-cce.sh dev v5-alpha 1 goods"
    echo "    docker-auto-cce.sh test v5-beta 1 goods 2020-june"
    echo "    docker-auto-cce.sh prd master 0 all"
    echo ""
    echo "Options:"
    echo "    [env]"
    echo "        dev - development environment"
    echo "        test - testing environment"
    echo "        prd - production environment"
    echo ""
    echo "    [source_branch]"
    echo "        'master' or any other git branch names"
    echo ""
    echo "    [is_debug]"
    echo "        1 - debug level enabled"
    echo "        0 - debug level disabled"
    echo ""
    echo "    [service_id]"
    echo "        all - all of services will be deployed"
    echo "        'goods' or any other service name"
    echo ""
    echo "    [version_tag]"
    echo "        a postfix attached the version number, e.g. 2020-june as 'goods:2.1.0-2020-june'"
    exit -1
fi

echo "IN_GITLAB_CI: "$IN_GITLAB_CI
if test "$IN_GITLAB_CI" != "1"; then
    current_branch=`git symbolic-ref -q --short HEAD`
    if [ "$current_branch" != "$source_branch" ]; then
        echo "Abort: current branch <"$current_branch"> is not <"$source_branch">, checkout the correct branch first!"
        exit -1
    fi
fi

if [ -f ".trpc-required" ]; then
    if [ ! -d "trpc" ]; then
        echo "Abort: trpc project required, clone it first!"
        exit -1
    else
        cd trpc;
        current_branch=`git symbolic-ref -q --short HEAD`
        if [ "$current_branch" != "$source_branch" ]; then
            echo "Abort: current branch of trpc <"$current_branch"> is not <"$source_branch">, checkout the correct branch first!"
            exit -1
        fi

        echo ">>> pull the latest of trpc project ..."
        git pull
        cd ..
    fi
fi

# using local kubectl configuration, include k8s login credentials
export KUBECONFIG=./.cceconfig-$scope

# login to the cce registry
echo ">>> docker login to cce image repository ..."
docker_user=`cat .cce-image-user-$scope`
docker login \
    -u $docker_user \
    $_CCE_IMAGE_REGISTRY --password-stdin < .cce-image-password-$scope

# two replicas only for production mode
if [ "$env" = "prd" ]; then
    _PODS_REPLICAS=2
fi

echo ">>> the replicas is "$_PODS_REPLICAS

if [ "$service_id" != "all" ]; then
    echo '>>> deploy service '$service_id
    if [ -f ".standalone-deploy" ]; then
        deployService . $service_id $version_tag
    else
        deployService $service_id $service_id $version_tag
    fi
else
    echo '>>> all services will be deployed! '$service_id
    for m in *; do
        if [ "$m" != "mc" ]; then
            echo '>>> deploy service '$m
            deployService $m $m $version_tag
        fi
    done
fi
