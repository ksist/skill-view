/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

requirejs.config(
{
  // Path mappings for the logical module names
  paths:
  //injector:mainReleasePaths
  {
    "knockout": "libs/knockout/knockout-3.4.0.debug",
    "jquery": "libs/jquery/jquery-2.1.3",
    "jqueryui-amd": "libs/jquery/jqueryui-amd-1.11.4",
    "promise": "libs/es6-promise/promise-1.0.0",
    "hammerjs": "libs/hammer/hammer-2.0.4",
    "ojdnd": "libs/dnd-polyfill/dnd-polyfill-1.0.0",
    "ojs": "libs/oj/v2.0.2/debug",
    "ojL10n": "libs/oj/v2.0.2/ojL10n",
    "ojtranslations": "libs/oj/v2.0.2/resources",
    "knockout-amd-helpers": "libs/knockout/knockout-amd-helpers",
    "text": "libs/require/text",
    "signals": "libs/js-signals/signals"
  }
  //endinjector
  ,
  // Shim configurations for modules that do not expose AMD
  shim:
  {
    "jquery":
    {
      exports: ["jQuery", "$"]
    }
  }
}
);

require(["ojs/ojcore", 
  "knockout", 
  "jquery", 
  "ojs/ojknockout", 
  "knockout-amd-helpers",
  "ojs/ojmodule", 
  "ojs/ojrouter", 
  "ojs/ojnavigationlist",
  "ojs/ojdatacollection-common",
  "text"
],
    function(oj, ko, $) {

        ko.amdTemplateEngine.defaultPath = "views";
        ko.amdTemplateEngine.defaultSuffix = ".html";

        function MainViewModel() {
            var self = this;
            self.titleLabel = ko.observable("スキル可視化");
            self.copyright = ko.observable("Copyright © 2016, NCS&A Co., Ltd.");
            self.params = ko.observable();

            var router = oj.Router.rootInstance;
            router.configure({
                'search': {label: '社員検索', isDefault: true},
                'employee': {label:'社員情報',
                    enter: function() {
                        var childRouter = router.createChildRouter('emp');
                        router.currentState().value = childRouter;
                    },
                    exit: function() {
                        var childRouter = router.currentState().value;
                        childRouter.dispose();
                    }
                },
                'employeeFromExam': {label: '社員一覧'},
                'employeeFromEdu': {label: '社員一覧'},
                'employeeFromSkill': {label: '社員一覧'},
                'employeeSearch': {label: '社員一覧'},
                'examSearch': {label: '資格検索'},
                'educationSearch': {label: '教育検索'},
                'inventorySearch': {label: 'スキル検索'}
            })
            self.router = router;
            self.moduleConfig = ko.pureComputed(function () {
                return router.moduleConfig;
            })

            self.optionChangeHandler = function (event, data) {
                // Only go for user action events
                // if (('ojAppNav' === event.target.id || 'ojAppNav2' === event.target.id) && event.originalEvent) {
                    self.router.go(data.value);
                // }
            };
            self.showEmployee = function(employeeCode, data, event) {
                history.pushState(null, '', '?root=employee&emp=' + employeeCode);
                oj.Router.sync();
            }

            self.showEmployeeList = function(data, event) {
                self.params = data;
                history.pushState(null, '', '?root=employeeSearch');
                oj.Router.sync();
            }

            self.showHome = function() {
                self.router.go('search');
            }
            self.showExam = function() {
                self.router.go('examSearch');
            }
            self.showEducation = function() {
                self.router.go('educationSearch');
            }
            self.showInventory = function() {
                self.router.go('inventorySearch');
            }
          
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

        };

        $(document).ready(function() {
            ko.applyBindings(new MainViewModel(), document.getElementById("mainContent"));
            oj.Router.sync();
        });
    }
);
