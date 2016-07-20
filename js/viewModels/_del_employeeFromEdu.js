define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojrouter',
        'ojs/ojselectcombobox', 'promise', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojpagingcontrol', 'ojs/ojpagingcontrol-model', 
        'ojs/ojtable', 'ojs/ojarraytabledatasource'],
        function (oj, ko, $)
        {
            function EmpoyeeListViewModel() {
                var self = this;
                self.allEmployee = ko.observableArray([]);
                self.ready = ko.observable(false);
                self.nameSearch = ko.observable('');
                self.codeSearch = ko.observable('');

                self.handleActivated = function(info) {
                    var parentRouter = info.valueAccessor().params.ojRouter.parentRouter;
                    self.childRouter = parentRouter.currentState().value;

                    self.childRouter.configure(function (stateId) {
                        var state;
                        if (stateId) {
                            var data = stateId.toString();
                            state = new oj.RouterState(data, {
                                value: data,
                                // For each state, before entering the state,
                                // make sure the data for it is loaded.
                                canEnter: function () {
                                    // The state transition will be on hold
                                    // until loadData is resolved.
                                    return self.loadData(data);
                                }
                            });
                        }
                        return state;
                    });
                    return oj.Router.sync();
                };

                self.loadData = function (value) {
                    return new Promise(function (resolve, reject) {
                        var url = "js/test/employeeedu" + value + ".json";
                        self.allEmployee.removeAll();
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

                            resolve(true);
                        }).fail(function (error) {
                            console.log('Error: ' + error.message);
                            resolve(false);
                        });
                    });
                };

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

                    self.ready(true);
                    return employeeFilter;
                }); 

                self.dataSource = ko.computed(function () {
                    return new oj.ArrayTableDataSource(self.filteredAllEmployee());
                });


            }
            return new EmpoyeeListViewModel;
        }
)
