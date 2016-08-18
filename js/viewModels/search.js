define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojpagingcontrol', 'ojs/ojtable', 'ojs/ojarraytabledatasource'],
        function (oj, ko, $)
        {
            function searchViewModel() {
                var self = this;
                self.allEmployee = ko.observableArray([]);
                self.nameSearch = ko.observable('');
                self.codeSearch = ko.observable('');
                self.isLoading = ko.observable(true);

                // 社員一覧の取得
                var url = 'js/test/employees.json';
                // var url = 'http://172.16.9.99/rest/employees';
                $.getJSON(url).then(function(employees) {
                    $.each(employees, function() {
                        self.allEmployee.push({
                            employeeCode: this.employeeCode,
                            employeeName: this.employeeName,
                            belongName: this.belongName,
                            grade: this.grade,
                            jobTitle: this.jobTitle
                        });
                    });
                }).always(function() {
                    self.isLoading(false);
                });
                
                // 社員の絞り込み
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
            return searchViewModel;
        }
)
