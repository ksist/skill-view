define(['ojs/ojcore', 'knockout', 'jquery', 'moment', 'ojs/ojtable',　'ojs/ojdialog', 
        'ojs/ojrowexpander', 'ojs/ojdatetimepicker', 'ojs/ojselectcombobox',
        'ojs/ojflattenedtreedatagriddatasource', 'ojs/ojjsontreedatasource', 'ojs/ojknockout-validation'],
    function (oj, ko, $, moment)
    {
        function careerEntryViewModel() {
            var self = this;
            self.moment = moment;
            self.startDate = ko.observable("");
            self.endDate = ko.observable("");
            self.industryType = ko.observable("");
            self.os = ko.observable("");
            self.language = ko.observable("");
            self.db = ko.observable("");
            self.workName = ko.observable("");
            self.workOutline = ko.observable("");
            self.projectCount = ko.observable("");
            self.role = ko.observable([]);
            self.phases = ko.observableArray([]);
            self.careers = ko.observableArray([]);
            self.careerData = ko.observable();

            self.dateConverter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
                .createConverter({pattern: 'yyyy/MM'});
            self.tracker = ko.observable();

            self.buttonMode = ko.observable("add");
            self.isLoading = ko.observable(true);

            // テスト用（実際にはDBから取得する））
            self.phaseArray = [
                {value: "1.調査分析・要件定義"},
                {value: "2.基本設計"},
                {value: "3.機能設計"},
                {value: "4.詳細設計"},
                {value: "5.製造（ｺｰﾃﾞｨﾝｸﾞ）"},
                {value: "6.単体ﾃｽﾄ"},
                {value: "7.結合ﾃｽﾄ"},
                {value: "8.総合ﾃｽﾄ"},
                {value: "9.受入・運用ﾃｽﾄ"},
                {value: "10.ｼｽﾃﾑ運用・保守"},
                {value: "11.DB設計"},
                {value: "12.DB構築"},
                {value: "13.ｻｰﾊﾞ設計"},
                {value: "14.ｻｰﾊﾞ構築"},
                {value: "15.ｻｰﾊﾞ運用・保守"},
                {value: "16.NW設計"},
                {value: "17.NW構築"},
                {value: "18.NW運用・保守"},
                {value: "19.品質分析・PMO"},
                {value: "20.その他"}
            ]
            self.roleArray = [
                {value: ""},
                {value: "プロジェクトマネージャー"},
                {value: "プロジェクトリーダー"},
                {value: "サブリーダー"},
                {value: "メンバー"}
            ]

            /**
             * 初期ロード時に呼ばれる
             */
            self.handleActivated = function(info) {
                var parentRouter = info.valueAccessor().params.ojRouter.parentRouter;
                self.empRouter = parentRouter.currentState().value;

                self.empRouter.configure(function (stateId) {
                    var state;
                    if (stateId) {
                        var data = stateId.toString();
                        state = new oj.RouterState(data, {
                            value: data,
                            canEnter: function () {
                                return self.loadData(data);
                            }
                        });
                    }
                    return state;
                });
                return oj.Router.sync();
            };

            /**
             * 社員データの読み込み
             */
            self.loadData = function (id) {
                return new Promise(function (resolve, reject) {
                    var url = "js/test/employee" + id + ".json";
                    $.getJSON(url).then(function(person) {
                        self.employee = person;
                        person.careers.forEach(function (career, i) {
                            self.careers.push(convertCareerArray(career));
                        })
                        var options = [];
                        self.careerData(new oj.FlattenedTreeTableDataSource(
                            new oj.FlattenedTreeDataGridDataSource(
                                new oj.JsonTreeDataSource(self.careers()), options)));

                        resolve(true);
                    }).fail(function (error) {
                        console.log('Error: ' + error.message);
                        resolve(false);
                    });
                    self.isLoading(false);
                });
            };

            /**
             * 配列から重複しているものを除いた配列を返す
             * 重複しているかを見る項目はitemで指定する
             * @return 重複した項目を除いた後の配列
             */
            function distinctArray(array, item) {
                var tempArray = new Array();
                ko.utils.arrayForEach(array, function(r){
                    tempArray.push(r[item]);
                })
                return ko.utils.arrayGetDistinctValues(tempArray);
            }

            /**
             * 追加ボタン
             */
            self.addClick = function(data, event) {
                // エラーチェック
                var trackerObj = ko.utils.unwrapObservable(self.tracker);
                if (!this._showComponentValidationErrors(trackerObj)) {
                    return;
                }

                // @TODO 日付チェックを実装したらコメントを外す
                // if (!this._runAppLevelValidation(trackerObj)) {
                //     return;
                // }

                // RowExpander で使用している id をリセット
                self.careers().forEach(function(career, i) {
                    delete self.careers()[i].attr.id;
                    delete self.careers()[i].children[0].attr.id;
                });
                var career = {};
                career.industryType = self.industryType();
                career.startDate = self.startDate();
                career.endDate = self.endDate();
                career.workName = self.workName();
                career.os = self.os();
                career.language = self.language();
                career.db = self.db();
                career.workOutline = self.workOutline();
                career.projectCount = self.projectCount();
                career.role = self.role();
                career.phases = [];
                self.phases().forEach(function(phase, i) {
                    career.phases.push({"phaseName": phase})
                })
                self.careers.unshift(convertCareerArray(career));
                var options = [];
                self.careerData(new oj.FlattenedTreeTableDataSource(
                    new oj.FlattenedTreeDataGridDataSource(
                        new oj.JsonTreeDataSource(self.careers()), options)));
                clearForm();
            }

            /**
             * 追加ボタンの表示／非表示切り替え
             */
            self.shouldDisableAddButton = function()
            {
                var trackerObj = ko.utils.unwrapObservable(self.tracker), 
                    hasInvalidComponents = trackerObj ? trackerObj["invalidShown"] : false;
                return  hasInvalidComponents;
            };

            /**
             * 削除ボタン
             */
            self.delClick = function(data, event) {
                $("#modalDialog").ojDialog("open");
                self.rowId = data.id;
            }

            /**
             * ダイアログのOKボタン
             */
            self.handleOKClose = function(data, event) {
                $("#modalDialog").ojDialog("close"); 
                self.careers().forEach(function(career, i) {
                    if (career.attr.id === self.rowId) {
                        self.careers.splice(i, 1);
                    }
                    // RowExpander で使用している id をリセット
                    delete self.careers()[i].attr.id;
                    delete self.careers()[i].children[0].attr.id;
                });
                var options = [];
                self.careerData(new oj.FlattenedTreeTableDataSource(
                    new oj.FlattenedTreeDataGridDataSource(
                        new oj.JsonTreeDataSource(self.careers()), options)));
                clearForm();
            };

            /**
             * ダイアログのキャンセルボタン
             */
            self.handleCancelClose = function(data, event) {
                $("#modalDialog").ojDialog("close");
            };
            
            /**
             * 編集ボタン
             */
            self.editClick = function(data, event) {
                var tempCareer;
                self.careers().forEach(function(career, i) {
                    if (career.attr.id === data.id) {
                        tempCareer = self.careers()[i];
                    }
                });
                self.startDate(tempCareer.attr.startDate);
                self.endDate(tempCareer.attr.endDate);
                self.industryType(tempCareer.attr.industryType);
                self.workName(tempCareer.attr.workName);
                self.os(tempCareer.attr.os);
                self.language(tempCareer.attr.language);
                self.db(tempCareer.attr.db);
                self.workOutline(tempCareer.children[0].attr.workOutline);
                self.phases.removeAll();
                tempCareer.children[0].attr.phases.forEach(function(phase, i) {
                    self.phases.push(phase.phaseName);
                });
                self.role(tempCareer.children[0].attr.role);
                self.projectCount(tempCareer.children[0].attr.projectCount);
                self.buttonMode("update");
                self.rowId = data.id;
            }

            /**
             * 更新ボタン
             */
            self.updateClick = function(data, event) {
                // エラーチェック
                var trackerObj = ko.utils.unwrapObservable(self.tracker);
                if (!this._showComponentValidationErrors(trackerObj)) {
                    return;
                }

                // @TODO 日付チェックを実装したらコメントを外す
                // if (!this._runAppLevelValidation(trackerObj)) {
                //     return;
                // }

                tempCareer = {};
                tempCareer.industryType = self.industryType();
                tempCareer.startDate = self.startDate();
                tempCareer.endDate = self.endDate();
                tempCareer.workName = self.workName();
                tempCareer.os = self.os();
                tempCareer.language = self.language();
                tempCareer.db = self.db();
                tempCareer.workOutline = self.workOutline();
                tempCareer.projectCount = self.projectCount();
                tempCareer.role = self.role();
                tempCareer.phases = [];
                self.phases().forEach(function(phase, i) {
                    tempCareer.phases.push({"phaseName": phase})
                })
                self.careers().forEach(function(career, i) {
                    if (career.attr.id === self.rowId) {
                        self.careers()[i] = convertCareerArray(tempCareer);
                    }
                });
                var options = [];
                self.careerData(new oj.FlattenedTreeTableDataSource(
                    new oj.FlattenedTreeDataGridDataSource(
                        new oj.JsonTreeDataSource(self.careers()), options)));
                clearForm();
            }
            
            /**
             * 業務経歴データを ojRowExpander に渡すために変換
             * @return 変換後の配列
             */
            function convertCareerArray(career) {
                    var tempCareer = {"attr": {}, "children": [{"attr": {}}]};
                    tempCareer.attr.industryType = career.industryType;
                    tempCareer.attr.startDate = career.startDate;
                    tempCareer.attr.endDate = career.endDate;
                    tempCareer.attr.workName = career.workName;
                    tempCareer.attr.os = career.os;
                    tempCareer.attr.language = career.language;
                    tempCareer.attr.db = career.db;
                    tempCareer.children[0].attr.workOutline = career.workOutline;
                    tempCareer.children[0].attr.projectCount = career.projectCount;
                    tempCareer.children[0].attr.role = career.role;
                    tempCareer.children[0].attr.phases = career.phases;
                return tempCareer;
            }

            /**
             * フォームの入力をクリアする
             */
            function clearForm() {
                self.industryType("");
                self.startDate("");
                self.endDate("");
                self.workName("");
                self.os("");
                self.language("");
                self.db("");
                self.workOutline("");
                self.projectCount("");
                self.role("");
                self.phases([]);
                self.buttonMode("add");                
            }

            self._showComponentValidationErrors = function (trackerObj)
            {
                trackerObj.showMessages();
                if (trackerObj.focusOnFirstInvalid())
                    return false;

                return true;
            };

            // @TODO 日付チェックを実装したらコメントを外す
            // self._runAppLevelValidation = function (trackerObj)
            // {
            //     var valid = true;

            //     // Validate email address and phoneNumber against the contactPref 
            //     valid = (this._validateObservable(this.emailAddress,
            //                                     this.emailAddrCRValidator,
            //                                     this.emailAddressMessages) &&
            //             this._validateObservable(this.phoneNumber,
            //                                     this.phoneNumCRValidator,
            //                                     this.phoneNumberMessages));                                  

            //     if (!valid)
            //     {
            //     trackerObj.focusOnFirstInvalid();
            //     return false;
            //     }

            //     return true;
            // };
        }
        return careerEntryViewModel;
    }
)
