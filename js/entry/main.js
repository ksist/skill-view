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
    "knockout": "../../bower_components/knockout/dist/knockout.debug",
    "jquery": "../../bower_components/jquery/dist/jquery",
    "jqueryui-amd": "../../bower_components/jquery-ui/ui",
    "promise": "../../bower_components/es6-promise/promise",
    "hammerjs": "../../bower_components/hammerjs/hammer",
    "ojdnd": "../../bower_components/oraclejet/dist/js/libs/dnd-polyfill/dnd-polyfill-1.0.0",
    "ojs": "../../bower_components/oraclejet/dist/js/libs/oj/debug",
    "ojL10n": "../../bower_components/oraclejet/dist/js/libs/oj/ojL10n",
    "ojtranslations": "../../bower_components/oraclejet/dist/js/libs/oj/resources",
    "knockout-amd-helpers": "../../bower_components/knockout-amd-helpers/build/knockout-amd-helpers",
    "text": "../../bower_components/text/text",
    "signals": "../../bower_components/js-signals/dist/signals",
    "moment": "../../bower_components/moment/moment"
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

            // URLルールティングの設定
            var router = oj.Router.rootInstance;
            router.configure({
                'search': {label: '業務経歴入力', isDefault: true},
                'careerEntry': {label:'業務経歴入力',
                    enter: function() {
                        var childRouter = router.createChildRouter('emp');
                        router.currentState().value = childRouter;
                    },
                    exit: function() {
                        var childRouter = router.currentState().value;
                        childRouter.dispose();
                    }
                }
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
                history.pushState(null, '', '?root=careerEntry&emp=' + employeeCode);
                oj.Router.sync();
            }
          
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

        };

        $(document).ready(function() {
            ko.applyBindings(new MainViewModel(), document.getElementById("mainContent"));
            oj.Router.sync();
        });
    }
);
