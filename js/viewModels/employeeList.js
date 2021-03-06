define(['ojs/ojcore', 'knockout', 'jquery', 'common', 'ojs/ojtable'],
        function (oj, ko, $, common)
        {
            function empoyeeListViewModel($params) {
                var self = this;
                self.allEmployee = ko.observableArray([]);
                self.nameSearch = ko.observable('');
                self.codeSearch = ko.observable('');
                self.condition = $params;
                self.searchCondition = ko.observable('');
                self.isLoading = ko.observable(true);

                var url;
                // 呼び出し元から渡されたパラメータの種類によってデータの取得元を変更
                if (self.condition.examName) {
                    url = common.contextUrl + 'employees/exam/' + self.condition.examName;
                    self.searchCondition = '資格名： ' + self.condition.examName;
                } else if (self.condition.educationName) {
                    url = common.contextUrl + 'employees/education/' + self.condition.educationName;
                    self.searchCondition = '教育名： ' + self.condition.educationName;
                } else if (self.condition.inventoryCode) {
                    url = common.contextUrl + 'employees/inventory/' + self.condition.inventoryCode + '/level/' + self.condition.level;
                    self.searchCondition = 'スキル： ' + self.condition.shoName + ' レベル' + self.condition.dispLevel;
                }

                // データを配列にセットする前に全削除
                self.allEmployee.removeAll();
                // データの取得
                $.getJSON(url).then(function(employees) {
                    $.each(employees, function() {
                        self.allEmployee.push({
                            employeeCode: this.employeeCode,
                            employeeName: this.employeeName,
                            belongName: this.belongName,
                            grade: this.grade,
                            jobTitle: this.jobTitle
                        });
                    })
                }, function(data) {
                    if (common.debug) {
                        console.log(data);
                    }
                    var rootViewModel = ko.dataFor(document.getElementById('mainContent'));
                    var router = rootViewModel.router;
                    router.go('error');
                }).always(function() {
                    self.isLoading(false);
                });

                /**
                 * 社員の絞り込み（社員番号 & 社員名）
                 */
                self.filteredAllEmployee = ko.computed(function () {
                    var employeeFilter = new Array();

                    if (self.allEmployee().length !== 0) {
                        if (self.nameSearch().length === 0 && self.codeSearch().length === 0)
                        {
                            employeeFilter = self.allEmployee();
                        } else if (self.nameSearch().length !== 0) {
                            ko.utils.arrayFilter(self.allEmployee(),
                                function (r) {
                                    var token = self.nameSearch();
                                    if (r.employeeName.indexOf(token) >= 0) {
                                        employeeFilter.push(r);
                                    }
                                }
                            );
                        } else if (self.codeSearch().length !== 0) {
                            ko.utils.arrayFilter(self.allEmployee(),
                                function (r) {
                                    var token = self.codeSearch();
                                    if (r.employeeCode.indexOf(token) === 0) {
                                        employeeFilter.push(r);
                                    }
                                }
                            );
                        }
                    }

                    return employeeFilter;
                }); 

                self.dataSource = ko.computed(function () {
                    return new oj.ArrayTableDataSource(self.filteredAllEmployee());
                });

            }
            return empoyeeListViewModel;
        }
)
