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
    "knockout": "../bower_components/knockout/dist/knockout.debug",
    "jquery": "../bower_components/jquery/dist/jquery",
    "jqueryui-amd": "../bower_components/jquery-ui/ui",
    "promise": "../bower_components/es6-promise/promise",
    "hammerjs": "../bower_components/hammerjs/hammer",
    "ojdnd": "../bower_components/oraclejet/dist/js/libs/dnd-polyfill/dnd-polyfill-1.0.0",
    "ojs": "../bower_components/oraclejet/dist/js/libs/oj/debug",
    "ojL10n": "../bower_components/oraclejet/dist/js/libs/oj/ojL10n",
    "ojtranslations": "../bower_components/oraclejet/dist/js/libs/oj/resources",
    "knockout-amd-helpers": "../bower_components/knockout-amd-helpers/build/knockout-amd-helpers",
    "text": "../bower_components/text/text",
    "signals": "../bower_components/js-signals/dist/signals",
    "moment": "../bower_components/moment/moment",
    "common": "common"
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
  },

  // キャッシュ対策
  urlArgs: "ｖ=" + (new Date()).getTime()
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
            self.copyright = ko.observable("Copyright © 2016, NCS&A Co., Ltd.");
            self.params = ko.observable();

            // URLルールティングの設定
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
                'employeeSearch': {label: '社員一覧'},
                'examSearch': {label: '資格検索'},
                'educationSearch': {label: '教育検索'},
                'inventorySearch': {label: 'スキル検索'}
            })
            self.router = router;
            self.moduleConfig = ko.pureComputed(function () {
                return router.moduleConfig;
            })

            /**
             * タブ変更時
             */
            self.optionChangeHandler = function (event, data) {
                if (event.originalEvent) {
                    self.router.go(data.value);
                }
            };

            /**
             * 社員選択時
             */
            self.showEmployee = function(employeeCode, data, event) {
                history.pushState(null, '', '?root=employee&emp=' + employeeCode);
                oj.Router.sync();
            }

            /**
             * 社員の絞り込み
             * dataに登録されている条件で絞り込む
             */
            self.showEmployeeList = function(data, event) {
                self.params = data;
                history.pushState(null, '', '?root=employeeSearch');
                oj.Router.sync();
            }

            /**
             * 社員検索タブ
             * optionChangeHandler は変更された時しか呼ばれないため、
             * 選択されているタブがクリックされた時用（以下３つも同じ）
             */
            self.showHome = function() {
                self.router.go('search');
            }

            /**
             * 資格検索タブ
             */
            self.showExam = function() {
                self.router.go('examSearch');
            }
            
            /**
             * 教育検索タブ
             */
            self.showEducation = function() {
                self.router.go('educationSearch');
            }

            /**
             * スキル検索タブ
             */
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
