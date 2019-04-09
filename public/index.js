const mainController = ($scope, $http, $window) => {
  $scope.formData = {};
  $scope.user = '';
  $scope.formCategory = '';
  $scope.lists = [];
  $scope.list = [];

  $scope.getTodos = () => {
    $http
      .get('/api/list')
      .then(data => {
        $scope.list = data.data;
        $scope.getLists();
        $scope.getFilteredTodos();
      })
      .catch(data => {
        console.log('Error: ' + data);
      });
  };

  $scope.getLists = () => {
    $http
      .get('/api/lists')
      .then(data => {
        $scope.lists = data.data;
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  $scope.createTodo = () => {
    if ($scope.formData.todo !== undefined) {
      $http
        .post('/api/list', $scope.formData)
        .then(data => {
          $scope.formData.todo = '';
          $scope.list = data.data;
          $scope.getFilteredTodos();
        })
        .catch(data => {
          console.log('Error: ' + data);
        });
    }
  };

  $scope.deleteTodo = id => {
    $http
      .delete('/api/list/' + id)
      .then(data => {
        $scope.getTodos();
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  $scope.checkTodo = id => {
    $http
      .put('/api/list/' + id)
      .then(data => {
        $scope.getTodos();
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  $scope.updateTodo = x => {
    // we get the todo and compare it with the current one
    // to see if it has changed
    $http
      .get('/api/list/todo/' + x._id)
      .then(data => {
        if (data.data.todo !== x.todo) {
          $http
            .put('/api/list/todo/' + x._id, x)
            .then(data => {
              $scope.list = data.data;
            })
            .catch(err => {
              console.log('Error: ' + err);
            });
        }
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  $scope.getCurrentUser = () => {
    $http
      .get('/api/list/user')
      .then(data => {
        $scope.user = data.data;
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  $scope.getFilteredTodos = () => {
    $scope.filteredList = $scope.list.filter(x => {
      return x.category === $scope.formData.category;
    });
  };

  $scope.createCategory = () => {
    $http
      .post('/api/lists/' + $scope.formCategory)
      .then(() => {
        $scope.getLists();
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  $scope.logout = () => {
    $http
      .get('/logout')
      .then(data => {
        $window.location.href = '/login';
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  $scope.getCurrentUser();
  $scope.getTodos();
};

const loginController = ($scope, $http, $window) => {
  $scope.credentials = {};
  $scope.login = () => {
    $http
      .post('/login', $scope.credentials)
      .then(data => {
        if (data.data.status === 401 || data.data === false)
          $window.location.href = '/login';
        else $window.location.href = '/todo';
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };
};

const signupController = ($scope, $http, $window) => {
  $scope.credentials = {};
  $scope.confirmPassword = '';
  $scope.signup = () => {
    if ($scope.credentials.password === $scope.confirmPassword) {
      $http
        .post('/signup', $scope.credentials)
        .then(data => {
          alert('Vous êtes inscrit !');
          if (data.status === 200) $window.location.href = '/login';
          else $window.location.href = '/signin';
        })
        .catch(err => {
          console.log('Error: ' + err);
        });
    }
  };
};

const TodoApp = angular
  .module('TodoApp', [])
  .controller('mainController', mainController);

const LoginApp = angular
  .module('LoginApp', [])
  .controller('loginController', loginController);

const SignupApp = angular
  .module('SigninApp', [])
  .controller('signinController', signupController);
