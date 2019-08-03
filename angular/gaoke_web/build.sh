#!/bin/bash -ile

OS=`uname`
ARGS=

ACTION=

PROJECT=
VERSION=
SUFFIX=
TIMESTAMP=

CLEAN=false
BUILD=false
PUBLISH=false

NPMINSTALL=false

PACKAGE_NAME=
PACKAGE_VERSION=

DOCKER_IMAGE_NAME=
DOCKER_IMAGE_TAG=

RET=

function echo_action() {
    INFO_START='\033[1;36m'
    INFO_END='\033[0m'
    echo -e "\xF0\x9F\x90\xB6 ${INFO_START}$1${INFO_END}"
}

function echo_info() {
    INFO_START='\033[1;32m'
    INFO_END='\033[0m'
    echo -e "\xF0\x9F\x92\x9A ${INFO_START}$1${INFO_END}"
}

function echo_warn() {
    INFO_START='\033[1;33m'
    INFO_END='\033[0m'
    echo -e "\xF0\x9F\x92\x9B ${INFO_START}$1${INFO_END}"
}

function echo_err() {
    INFO_START='\033[1;31m'
    INFO_END='\033[0m'
    echo -e "\xF0\x9F\x92\x94 ${INFO_START}$1${INFO_END}" >&2
}

function showUsages() {
    echo "usage:"
    echo "  ./build release  [-C] [-B] [-P] [-n] -p <project> -v <version> { -t <timestamp> | -s <suffix> }"
    echo "  ./build docker [-C] [-B] [-P] -p <project> -v <version> { -t <timestamp> | -s <suffix> }"
    echo "  ./build.sh -h|--help"
    echo "description:"
    echo "  -C | --clean            - clean project"
    echo "  -B | --build            - build project and generate npm package"
    echo "  -P | --publish          - publish npm package to Nexus repository"
    echo ""
    echo "  -n | --npminstall       - do npm install to install build tools"
    echo ""
    echo "  -p | --project          - name of project"
    echo "  -v | --version          - version of this build"
    echo "  -s | --suffix           - suffix of package name"
    echo "  -t | --timestamp        - timestamp of this build"
    echo ""
    echo "  -h | --help             - show usage"
    echo "examples:"
    echo "  Clean release build environment only"
    echo "  ./build release -C -p ${projectName}"
    echo ""
    echo "  Build Release without clean"
    echo "  ./build release -L -B -P -n -p ${projectName} -v ${version} -t `date +'%Y%m%d%H%M%S'`"
    echo "  ./build release -L -B -P -n -p ${projectName} -v ${version} -s 'release'"
    echo ""
    echo "  Build Docker with separated steps"
    echo "  ./build docker -C -p property"
    echo "  ./build docker -B -p property -v 1.0.0 -t `date +'%Y%m%d%H%M%S'`"
    echo "  ./build docker -P -p property -v 1.0.0 -t `date +'%Y%m%d%H%M%S'`"
    echo ""
    echo "  Build Docker with one step"
    echo "  ./build docker -C -B -P -p property -v 1.0.0 -t `date +'%Y%m%d%H%M%S'`"

}

function cleanRelease() {
    echo_action "Cleaning project ..."

    if [ -d './node_modules' ]; then
        rm -rf './node_modules'
        if [ "$?" != "0" ]; then
            echo_warn "WARNING: Failed to remove ${PROJECT}/node_modules"
        fi
    fi

    if [ -d './dist' ]; then
        rm -rf './dist'
        if [ "$?" != "0" ]; then
            echo_warn "WARNING: Failed to remove ${PROJECT}/dist"
        fi
    fi

    if [ -d './output' ]; then
        rm -rf './output'
        if [ "$?" != "0" ]; then
            echo_warn "WARNING: Failed to remove ${PROJECT}/output"
        fi
    fi

    if [ -f './package-lock.json' ]; then
        rm -f ./package-lock.json
        if [ "$?" != "0" ]; then
            echo_warn "WARNING: Failed to remove ${PROJECT}/package-lock.json"
        fi
    fi

    return 0
}

function installBuildTools() {
    echo_action "Installing build tools ..."
    npm install
    if [ "$?" != "0" ]; then
        echo_err "ERROR: Failed to install build tools."
        return 1
    else
        echo_info "Build tools have been installed successfully."
        return 0
    fi
}

function generatePackageName() {
    if [ "${SUFFIX}" != "" ]; then
        PACKAGE_NAME="${PROJECT}-${SUFFIX}"
    else
        PACKAGE_NAME="${PROJECT}"
    fi
}

function generatePackageVersion() {
    if [ "${TIMESTAMP}" != "" ]; then
        PACKAGE_VERSION="${VERSION}-${TIMESTAMP}"
    else
        PACKAGE_VERSION="${VERSION}"
    fi
}

function generateDockerImageName() {
    if [ "${SUFFIX}" != "" ]; then
        DOCKER_IMAGE_NAME="hileveps-web-${SUFFIX}"
    else
        DOCKER_IMAGE_NAME="hileveps-web"
    fi
}

function generateDockerImageTag() {
    if [ "${TIMESTAMP}" != "" ]; then
        DOCKER_IMAGE_TAG="${VERSION}-${TIMESTAMP}"
    else
        DOCKER_IMAGE_TAG="${VERSION}"
    fi
}

function buildSrc() {
    echo_action 'Building source code ...'
    npm run build
    if [ "$?" != "0" ]; then
        echo_err "ERROR: Failed to build hileveps web."
        return 1
    else
        echo_info "Source building has been done successfully."
        return 0
    fi
}

function generatePackageJSON() {
    echo_action 'Generating package.json ...'

    echo "{
        \"name\": \"${PACKAGE_NAME}\",
        \"version\": \"${PACKAGE_VERSION}\"
    }" > ./dist/package.json

    echo_info 'package.json is generated.'
}

function createNPMPackage() {
    echo_action 'Creating NPM package ...'

    PACKAGE=`npm pack ./dist`
    if [ "$?" == "0" ]; then
        OUTPUT_FOLER="./output"
        if [ ! -d "${OUTPUT_FOLER}" ]; then
            mkdir -p "${OUTPUT_FOLER}"
        fi

        mv "./${PACKAGE}" "${OUTPUT_FOLER}/"

        echo_info "Succeed build ${PACKAGE_VERSION}"
        return 0
    else
        echo_err "Failed to build ${PACKAGE_VERSION}"
        return 1
    fi
}

function publishNPMPackage() {
    echo_action "Publishing npm package to Nexus repository ..."

    # with the default, the publish command will mark the package as 'latest'. so, we need not do any more.
    npm publish "./output/${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz" --registry=http://47.105.153.253:9998/repository/npm-private/

    if [ "$?" != "0" ]; then
        echo_err "ERROR: Failed to publish '${PACKAGE_NAME}-${PACKAGE_VERSION}' to Nexus repository."
        return 1
    fi

    echo_info "NPM package '${PACKAGE_NAME}-${PACKAGE_VERSION}' has been published to Nexus repository"
    return 0
}

function buildRelease() {
    # generate package name and version
    generatePackageName
    generatePackageVersion

    # build source code
    buildSrc
    if [ "$?" != "0" ]; then
        return 1
    fi

    generatePackageJSON

    createNPMPackage
    if [ "$?" != "0" ]; then
        return 1
    fi

    return 0
}

function cleanDocker() {
    echo_action "Cleaning Docker build environment ..."

    TMP_FOLDER='./tmp'
    if [ -d "${TMP_FOLDER}" ]; then
        rm -rf "${TMP_FOLDER}"
    fi

    docker images | grep "${DOCKER_IMAGE_NAME}\|<none>" | awk '{print $3}' | while read id; do
        docker rmi --force ${id};
        if [ "$?" != "0" ]; then
            echo_warn "WARNING: Failed to remove image: ${DOCKER_IMAGE_NAME}@${id}"
        fi
    done
}

function publishDockerImages() {
    IMAGE_ID=`docker images | grep "${DOCKER_IMAGE_NAME}" | awk '{print $3}'`

    echo_action "Publishing docker image with tag: '${DOCKER_IMAGE_TAG}'"
    docker tag ${DOCKER_IMAGE_NAME}:latest registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
    if [ "$?" != "0" ]; then
        echo_err "ERROR: Failed to tag image '${DOCKER_IMAGE_NAME}:latest' to 'registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'"
        return 1
    fi

    docker push registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
    if [ "$?" != 0 ]; then
        echo_err "ERROR: Failed to publish registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} to Nexus registry."
        return 1
    fi

    echo_info "Docker image '${DOCKER_IMAGE_NAME}@${DOCKER_IMAGE_TAG}' has been published to Nexus registry."

    echo_action "Publishing docker image with tag: 'latest'"
    docker tag ${DOCKER_IMAGE_NAME}:latest registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:latest
    if [ "$?" != "0" ]; then
        echo_err "ERROR: Failed to tag image '${DOCKER_IMAGE_NAME}:latest' to 'registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:latest'"
        return 1
    fi

    docker push registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:latest
    if [ "$?" != 0 ]; then
        echo_err "ERROR: Failed to publish registry.cn-qingdao.aliyuncs.com/hileveps/${DOCKER_IMAGE_NAME}:latest to Nexus registry."
        return 1
    fi

    echo_info "Docker image '${DOCKER_IMAGE_NAME}@latest' has been published to Nexus registry"
    return 0
}

function buildDocker() {
    TMP_FOLDER='./tmp'
    if [ ! -d "${TMP_FOLDER}" ]; then
        mkdir -p "${TMP_FOLDER}"
    fi

    # copy npmrc to tmp
    cp ~/.npmrc "${TMP_FOLDER}/"

    echo_action 'Building Docker image ...'
    if [ "${SUFFIX}" != "" ]; then
        docker build -t "${DOCKER_IMAGE_NAME}" . --build-arg suffix="-${SUFFIX}" --no-cache
    else
        docker build -t "${DOCKER_IMAGE_NAME}" . --no-cache
    fi

    if [ "$?" != "0" ]; then
        echo_err "ERROR: Failed to create docker image of hileveps for build ${DOCKER_IMAGE_NAME}"
        return 1
    fi

    echo_info "Docker image ${DOCKER_IMAGE_NAME} has been created."
    return 0
}


###########################################################################################
## main

OPTIONS=`getopt -o CLBPnbp:v:t:s:h --long clean,build,publish,npminstall,project,version,timestamp,suffix,help -n 'build.sh' -- "$@"`
if [ $? != 0 ]; then
    echo_err "Error: failed to parse options"
    exit 1
fi

if [ "$OS" == "Linux" ] || [ "${OS%-*}" == "MINGW64_NT" ]; then
    eval set -- $OPTIONS
fi

while [ $# -gt 0 ]; do
    case "$1" in
        -C|--clean) CLEAN=true; shift;;
        -B|--build) BUILD=true; shift;;
        -P|--publish) PUBLISH=true; shift;;
        -n|--npminstall) NPMINSTALL=true; shift;;
        -p|--project) shift; PROJECT=$1; shift;;
        -v|--version) shift; VERSION=$1; shift;;
        -t|--timestamp) shift; TIMESTAMP=$1; shift;;
        -s|--suffix) shift; SUFFIX=$1; shift;;
        -h|--help) showUsages; exit 0;;
        --) shift; break;;
        -*|--*) echo_err "ERROR: Invalid option: $1" >&2; showUsages; exit 1;;
        *)
        if [ "$OS" == "Darwin" ]; then
            ARGS="$ARGS $1"
        fi
        shift;;
    esac
done

if [ "$OS" == "Linux" ] || [ "${OS%-*}" == "MINGW64_NT" ]; then
    ACTION=$1
elif [ "$OS" == "Darwin" ]; then
    if [ "$ARGS" != "" ]; then
        ACTION=`echo "$ARGS" | awk '{split($0,a," "); print a[1]}'`
    else
        echo_err "ERROR: Build action didn't specified."
        showUsages
        exit 1;
    fi
fi

if [ "${PROJECT}" == "" ]; then
    echo_err "ERROR: Project not set."
    showUsages
    exit 1;
fi

if [ "${ACTION}" == "release" ] || [ "${ACTION}" == "docker" ]; then
    if [ "${BUILD}" == "true" ] || [ ${PUBLISH} == "true" ]; then
        if [ "${VERSION}" == "" ]; then
            echo_err "ERROR: Version not set."
            showUsages
            exit 1;
        fi

        if [ "${TIMESTAMP}" == "" ] && [ "${SUFFIX}" == "" ]; then
            echo_err "ERROR: Timestamp and Suffix MUST be set one of them."
            showUsages
            exit 1
        fi
    fi
else
    echo_err "ERROR: Undefined action: ${ACTION}"
    showUsages
    exit 1
fi

#################################################
## Building process
if [ "${ACTION}" == "docker" ]; then
    generateDockerImageName

    if [ "${BUILD}" == "true" ] || [ "${PUBLISH}" == "true" ]; then
        generateDockerImageTag
    fi
fi

# clean project
if [ "${CLEAN}" == "true" ]; then
    if [ "${ACTION}" == "release" ]; then
        cleanRelease
        RET=$?
    elif [ "${ACTION}" == "docker" ]; then
        cleanDocker
        RET=$?
    fi

    if [ "${RET}" != "0" ]; then
        exit 1
    fi
fi

if [ "${BUILD}" == "true" ]; then
    # install build dependencies
    if [ "${NPMINSTALL}" == "true" ]; then
        installBuildTools
        if [ "$?" != "0" ]; then
            return 1
        fi
    fi

fi

# do build
if [ "${BUILD}" == "true" ]; then
    if [ "${ACTION}" == "release" ]; then
        buildRelease
        RET=$?
    elif [ "${ACTION}" == "docker" ]; then
        buildDocker
        RET=$?
    fi

    if [ "${RET}" != "0" ]; then
        exit 1
    fi
fi

# publish to Nexus repository
if [ "${PUBLISH}" == "true" ]; then
    if [ "${ACTION}" == "release" ]; then
        publishNPMPackage
        RET=$?
    elif [ "${ACTION}" == "docker" ]; then
        publishDockerImages
        RET=$?
    fi

    if [ "${RET}" != "0" ]; then
        exit 1
    fi
fi
## Building process done
#################################################
