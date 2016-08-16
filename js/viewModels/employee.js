define(['ojs/ojcore', 'knockout', 'jquery', 'moment', 'ojs/ojtable', 
        'ojs/ojrowexpander', 'ojs/ojflattenedtreedatagriddatasource', 'ojs/ojjsontreedatasource'],
    function (oj, ko, $, moment)
    {
        function employeeViewModel() {
            var self = this;
            self.moment = moment;
            self.allInventory = ko.observableArray([]);
            self.daiArray = ko.observableArray([]);
            self.chuArray = ko.observableArray([]);
            self.shoArray = ko.observableArray([]);

            self.detailsContentTemplate = ko.observable('employeeDetails/exam');
            self.isLoading = ko.observable(true);

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
                        self.examData = new oj.ArrayTableDataSource(person.exams);
                        self.eduData = new oj.ArrayTableDataSource(person.educations);
                        self.allInventory = person.inventories;
                        ko.utils.arrayForEach(distinctArray(self.allInventory, "daiName"), function(r) {
                            self.daiArray.push({
                                daiName: r
                            });
                        });
                        var options = [];
                        self.careerData = new oj.FlattenedTreeTableDataSource(
                            new oj.FlattenedTreeDataGridDataSource(
                                new oj.JsonTreeDataSource(convertCareerArray(person.careers)), options));
                        resolve(true);
                    }).fail(function (error) {
                        console.log('Error: ' + error.message);
                        resolve(false);
                    });
                    self.isLoading(false);
                });
            };

            /**
             * スキルズインベントリの大項目のリスト設定
             */
            self.daiSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.daiArray);
            });

            /**
             * スキルズインベントリの中項目のリスト設定
             * 大項目選択時に呼ばれる
             */
            self.chuSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.chuArray);
            });

            /**
             * スキルズインベントリの小項目のリスト設定
             * 小項目選択時に呼ばれる
             */
            self.shoSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.shoArray);
            });

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
             * スキルズインベントリの大項目選択時
             */
            self.selectDaiList = function (daiName) {
                self.chuArray.removeAll();
                self.shoArray.removeAll();
                self.shoArray.push({
                    inventoryCode: "",
                    daiName: "",
                    chuName: "",
                    shoName: "",
                    level: ""
                    });
                var filteredArray = new Array();
                ko.utils.arrayFilter(self.allInventory,
                    function (r) {
                        if (r.daiName === daiName) {
                            filteredArray.push(r);
                        }
                    }
                )
                ko.utils.arrayForEach(distinctArray(filteredArray, "chuName"), function(r) {
                    self.chuArray.push({
                        chuName: r
                    });
                });
            }

            /**
             * 中項目選択時
             */
            self.selectChuList = function (chuName) {
                self.shoArray.removeAll();
                ko.utils.arrayFilter(self.allInventory,
                    function (r) {
                        if (r.chuName === chuName) {
                            self.shoArray.push(r);
                        }
                    })
           }

           /**
            * 社員詳細のタブ選択時
            */
            self.tabClickHandler = function(data) {
                var newPage = 'employeeDetails/' + data;
                self.detailsContentTemplate(newPage);
                return true;
            }

            /**
             * 業務経歴データを ojRowExpander に渡すために変換
             * @return 変換後の配列
             */
            function convertCareerArray(careers) {
                var treeData = [];
                careers.forEach(function(career, i) {
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
                    treeData.push(tempCareer);
                })
                return treeData;
            }

        }
        return employeeViewModel;
    }
)
