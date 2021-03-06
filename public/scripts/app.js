
angular
  .module("contactsApp", ['ngRoute', 'satellizer'])
  .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: "ListController",
                templateUrl: "list.html",
                resolve: {
                    contacts: function(Contacts) {
                        return Contacts.getContacts();
                    }
                }
            })
            .when("/new/contact", {
                controller: "NewContactController",
                templateUrl: "/templates/contact-form.html"
            })
            .when("/login", {
                controller: "AuthController",
                templateUrl: "/templates/login.html"
            })
            .when("/register", {
                controller: "AuthController",
                templateUrl: "/templates/signup.html"
            })
            .when("/about", {
                templateUrl: "/templates/about.html"
            })
            .when("/search", {
                templateUrl: "/templates/search.html"
            })
            .when("/profile", {
                constroller: "ProfileController",
                templateUrl: "/templates/profile.html"
            })
            .when("/messages", {
                templateUrl: "/templates/messages.html"
            })
            .when("/contact/:contactId", {
                controller: "EditContactController",
                templateUrl: "/templates/contact.html"
            })
            .when("/new/vendor", {
                controller: "VendorController",
                templateUrl: "/templates/vendor.html",
                resolve: {
                    vendors: function(Vendors) {
                        return Vendors.getVendors();
                    }
                }
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Vendors", function($http) {
      this.createVendor = function(vendor) {
          return $http.post("/vendors", vendor).
              then(function(response) {
                  return response;
              }, function(response) {
                  alert("Error creating vendor.");
              });
      }
      this.getVendors = function() {
          return $http.get("/vendors").
              then(function(response) {
                  return response;
              }, function(response) {
                  alert("Error finding vendors.");
              });
      }
    })

    .service("Contacts", function($http) {
        this.getContacts = function() {
            return $http.get("/contacts").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });
        }
        this.createContact = function(contact) {
            return $http.post("/contacts", contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
        this.getContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
        this.editContact = function(contact) {
            var url = "/contacts/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(contacts, $scope) {
        $scope.contacts = contacts.data;
    })
    .controller("NewContactController", function($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveContact = function(contact) {
            Contacts.createContact(contact).then(function(doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("VendorController", function(vendors, $scope, $location, Vendors, $route) {
        $scope.back = function() {
            $location.path("#/");
        }
        $scope.vendors = vendors.data;

        $scope.saveVendor = function(vendor) {
            Vendors.createVendor(vendor).then(function(doc) {
                $route.reload();
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditContactController", function($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.contactId).then(function(doc) {
            $scope.contact = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "templates/contact-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.saveContact = function(contact) {
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.deleteContact = function(contactId) {
            Contacts.deleteContact(contactId);
        }
    })

    .controller('AuthController', ['$scope', '$auth', '$location',
      function ($scope, $auth, $location) {
        // if $scope.currentUser, redirect to '/profile'
        if ($scope.currentUser) {
          $location.path('/profile');
        }

        // clear sign up / login forms
        $scope.user = {};

        $scope.signup = function() {
          // signup (https://github.com/sahat/satellizer#authsignupuser-options)
          $auth.signup($scope.user)
            .then(function (response) {
              // set token (https://github.com/sahat/satellizer#authsettokentoken)
              $auth.setToken(response.data.token);
              // call $scope.isAuthenticated to set $scope.currentUser
              $auth.isAuthenticated();
              // clear sign up form
              $scope.user = {};
              // redirect to '/profile'
              $location.path('/profile');
            }, function (error) {
              console.error(error);
            });
        };

        $scope.login = function() {
          // login (https://github.com/sahat/satellizer#authloginuser-options)
          $auth.login($scope.user)
            .then(function (response) {
              // set token (https://github.com/sahat/satellizer#authsettokentoken)
              $auth.setToken(response.data.token);
              // call $scope.isAuthenticated to set $scope.currentUser
              $auth.isAuthenticated();
              // clear sign up form
              $scope.user = {};
              // redirect to '/profile'
              $location.path('/profile');
            }, function (error) {
              console.error(error);
            });
        };
      }]
    )
    .controller('ProfileController', ['$scope', '$auth', '$http', '$location',
    	function ($scope, $auth, $http, $location) {
        // if user is not logged in, redirect to '/login'
        if ($scope.currentUser === undefined) {
          $location.path('/login');
        }

        $scope.editProfile = function() {
          $http.put('/api/me', $scope.currentUser)
            .then(function (response) {
              $scope.showEditForm = false;
            }, function (error) {
              console.error(error);
              $auth.removeToken();
            });
        };
    }]);

SignupController.$inject = ["$location", "Account"]; // minification protection
function SignupController ($location, Account) {
  var vm = this;
  vm.new_user = {}; // form data

  vm.signup = function() {
    Account
      .signup(vm.new_user)
      .then(
        function (response) {
          vm.new_user = {}; // clear sign up form
          $location.path('/profile'); // redirect to '/profile'
        }
      );
  };
}
