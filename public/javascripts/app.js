angular.module('mtMeal', ['ui.bootstrap','ngStorage']);


/* ng-clock $rootScope $broadcast  $scope.$emit directive
bindonce
limitTo
分页

 */

var userListController = function($scope,$http,$modal,$sessionStorage,$log,$rootScope){
    $rootScope.sum = 0;
    $scope.activeList = [];
    $rootScope.users = users;
    $rootScope.groups = groups;
    $scope.isReseting = false;
    $scope.isManageing = false;
    $sessionStorage.isLogin = false;

    angular.forEach(users, function(group, i){
        angular.forEach(group, function(user, key){
            if(user.active){
                $rootScope.sum++;
            }
        });
    });

    //$scope.isSuccess=true;
    //$scope.isLoading=true;

    //订餐
    $scope.stun = function(user){
        user.loading=true;
        if(!user.active){
            $rootScope.sum++;
            $http.post('/add',{'id':user.id})
                .success(function(data,status,headers,config){
                    user.loading = false;
                    user.active = true;
                    console.log('success');
                })
                .error(function(data,status,headers,config){
                    console.log('error');
                });
        }else{
            $rootScope.sum--;
            $http.post('/remove',{'id':user.id})
                .success(function(data,status,headers,config){
                    user.loading = false;
                    user.active = false;
                })
                .error(function(data,status,headers,config){
                    console.log('error');
                });
        }
    }

    //重置
    $scope.reset = function(){
        $scope.isReseting = true;

        $rootScope.sum = 0;
        angular.forEach(users, function(group, i){
            angular.forEach(group, function(user, key){
                if(user.active){
                    user.active=false;
                }
            });
        });
        $http.post('/reset').success(function(data,status,headers,config){
            $scope.isReseting = false;
            console.log('success');
        }).error(function(data,status,headers,config){
                console.log('error');
        });
    }
    //管理
    $scope.manage = function() {
        if($sessionStorage.isLogin == false){
            var pswModal = $modal.open({
                templateUrl: 'pswModal.html',
                controller: pswModalCtrl,
                size: 'sm'
            });
            pswModal.result.then(function () {
                $scope.isManageing = true;

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }else{
            $scope.isManageing = !$scope.isManageing;

        }

    };
    //删除
    $scope.delUser = function(user){
        var delModal = $modal.open({
            templateUrl: 'delModal.html',
            controller: delModalCtrl,
            size: 'sm',
            resolve: {
                user: function(){
                    return user;
                }
            }
        });
    }
    //删除组
    $scope.delGroup = function(group){
        var delModal = $modal.open({
            templateUrl: 'delModal.html',
            controller: delGroupModalCtrl,
            size: 'sm',
            resolve: {
                group: function(){
                    return group;
                }
            }
        });
    }
    //添加用户
    $scope.addUser = function(groupId){
        var addUserModal = $modal.open({
            templateUrl: 'addUserModal.html',
            controller: addUserModalCtrl,
            size: 'sm',
            resolve: {
                groupId: function(){
                    return groupId;
                }
            }
        });
    }

    //添加组
    $scope.addGroup = function(){
        var addUserModal = $modal.open({
            templateUrl: 'addGroupModal.html',
            controller: addGroupModalCtrl,
            size: 'sm'
        });
    }

    //编辑组
    $scope.editGroup = function(group){
        var addUserModal = $modal.open({
            templateUrl: 'editGroupModal.html',
            controller: editGroupModalCtrl,
            size: 'sm',
            resolve: {
                group: function(){
                    return group;
                }
            }
        });
    }
}
var delModalCtrl = function($scope,$http,$modalInstance,user,$rootScope) {
    $scope.delName = user.name;
    $scope.ok = function() {
        user.loading = true;
        $modalInstance.dismiss('cancel');
        $http.post('/del',{'id':user.id})
            .success(function(data,status,headers,config){
                if(user.active==true){
                    $rootScope.sum--;
                    // TODO:此处有个bug，删除已经订饭的人，总和数组不减
                }
                console.log(user);
                user.loading = false;
                user.isHide = true;


            })
            .error(function(data,status,headers,config){
                console.log('error');
            });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
var delGroupModalCtrl = function($scope,$http,$modalInstance,group,$rootScope) {
    $scope.delName = group.name;
    $scope.ok = function() {

        $modalInstance.dismiss('cancel');
        $http.post('/delGroup',{'id':group.id})
            .success(function(data,status,headers,config){
                console.log($rootScope.groups)
                angular.forEach($rootScope.groups,function(g, i){
                    if(g.id==group.id){
                        console.log(i);
                        $rootScope.groups.splice(i,1);
                    }
                });
                console.log(group);

            })
            .error(function(data,status,headers,config){
                console.log('error');
            });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
var pswModalCtrl = function($scope, $sessionStorage,$modalInstance) {
    $scope.alerts = [];
    $scope.password = {value:''};
    $scope.ok = function() {
        if($scope.password.value == "12345"){
            $sessionStorage.isLogin = true;
            $modalInstance.close();
        }else{
            console.log($scope.password.value)
            $scope.alerts=[{type: 'danger',msg: '密码错误!'}];
        }
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

var addUserModalCtrl = function($scope,$http,$modalInstance,groupId,$rootScope) {
    $scope.newUser = { id: '',
        name: '',
        group: groupId,
        active: false,
        loading: false,
        isHide: false };

    $scope.ok = function() {
        if($scope.newUser.name != ""){
            $http.post('/addUser',{
                'name':$scope.newUser.name,
                'group':$scope.newUser.group
            })
                .success(function(data,status,headers,config){
                    $modalInstance.close();
                    var index;
                    angular.forEach($rootScope.groups, function(group, i){
                        if(group.id == groupId)index = i;
                    });
                    $scope.newUser.id = data.id;
                    $rootScope.users[index].push($scope.newUser);


                }).error(function(data,status,headers,config){
                    console.log('error');
                });

        }else{
            $scope.alerts=[{type: 'danger',msg: '请输入姓名!'}];
        }
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

var addGroupModalCtrl = function($scope,$http,$modalInstance,$rootScope) {
    $scope.newGroup = {
        id: '',
        name: ''
    };

    $scope.ok = function() {
        if($scope.newGroup.name != ""){
            $http.post('/addGroup',{
                'name':$scope.newGroup.name
            })
                .success(function(data,status,headers,config){
                    $modalInstance.close();

                    $rootScope.groups.push($scope.newGroup);

                }).error(function(data,status,headers,config){
                    console.log('error');
                });

        }else{
            $scope.alerts=[{type: 'danger',msg: '请输入名称!'}];
        }
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};


var editGroupModalCtrl = function($scope,$http,$modalInstance,$rootScope,group) {
    $scope.group = {
        id: group.id,
        name: group.name
    };

    $scope.ok = function() {
        if(group.name != ""){
            $http.post('/editGroup',{
                'id':group.id,
                'name':$scope.group.name
            })
                .success(function(data,status,headers,config){
                    console.log('editGroup');
                    $modalInstance.close();
                    angular.forEach($rootScope.groups, function(g, i){
                        if(g.id == group.id)$rootScope.groups[i].name = $scope.group.name;
                    });

                }).error(function(data,status,headers,config){
                    console.log('error');
                });

        }else{
            $scope.alerts=[{type: 'danger',msg: '请输入名称!'}];
        }
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};