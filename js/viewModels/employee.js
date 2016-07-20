define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable'],
    function (oj, ko, $)
    {
        function employeeViewModel() {
            var self = this;
            self.allInventory = ko.observableArray([]);
            self.daiArray = ko.observableArray([]);
            self.chuArray = ko.observableArray([]);
            self.shoArray = ko.observableArray([]);

            self.detailsContentTemplate = ko.observable('employeeDetails/exam');

            self.handleActivated = function(info) {
                var parentRouter = info.valueAccessor().params.ojRouter.parentRouter;
                self.empRouter = parentRouter.currentState().value;

                self.empRouter.configure(function (stateId) {
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
                        self.careerData = new oj.ArrayTableDataSource(person.careers);
                        resolve(true);
                    }).fail(function (error) {
                        console.log('Error: ' + error.message);
                        resolve(false);
                    });
                });
            };

            self.daiSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.daiArray);
            });

            self.chuSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.chuArray);
            });

            self.shoSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.shoArray);
            });

            // self.levelSource = ko.computed(function() {
            //     return new oj.ArrayTableDataSource(self.levelArray);
            // });

            function distinctArray(array, item) {
                var tempArray = new Array();
                ko.utils.arrayForEach(array, function(r){
                    tempArray.push(r[item]);
                })
                return ko.utils.arrayGetDistinctValues(tempArray);
            }
            
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

            self.selectChuList = function (chuName) {
                self.shoArray.removeAll();
                ko.utils.arrayFilter(self.allInventory,
                    function (r) {
                        if (r.chuName === chuName) {
                            self.shoArray.push(r);
                        }
                    })
           }

            self.tabClickHandler = function(data) {
                var newPage = 'employeeDetails/' + data;
                self.detailsContentTemplate(newPage);
                return true;
            }


        }
        return employeeViewModel;
    }
)
