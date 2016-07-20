define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable', 'ojs/ojarraytabledatasource'],
    function (oj, ko, $)
    {
        function inventorySearchViewModel() {
            var self = this;
            self.allInventory = ko.observableArray([]);
            self.ready = ko.observable(false);
            self.nameSearch = ko.observable('');
            self.daiArray = ko.observableArray([]);
            self.chuArray = ko.observableArray([]);
            self.shoArray = ko.observableArray([]);
            self.levelArray = ko.observableArray([]);

            var url = 'js/test/inventories.json';
            $.getJSON(url).then(function(inventories) {
                $.each(inventories, function() {
                    self.allInventory.push({
                        inventoryCode: this.inventoryCode,
                        daiName: this.daiName,
                        chuName: this.chuName,
                        shoName: this.shoName
                    });
                });
                ko.utils.arrayForEach(distinctArray(self.allInventory(), "daiName"), function(r) {
                    self.daiArray.push({
                        daiName: r
                    });
                });
            });

            self.daiSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.daiArray);
            });

            self.chuSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.chuArray);
            });
 
            self.shoSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.shoArray);
            });

            self.levelSource = ko.computed(function() {
                return new oj.ArrayTableDataSource(self.levelArray);
            });

            self.selectDaiList = function (daiName) {
                self.chuArray.removeAll();
                self.shoArray.removeAll();
                self.shoArray.push({
                    inventoryCode: "",
                    daiName: "",
                    chuName: "",
                    shoName: ""
                    });
                self.levelArray.removeAll();
                self.levelArray.push({inventoryCode: "", level: "", dispLevel: ""});
                var filteredArray = new Array();
                ko.utils.arrayFilter(self.allInventory(),
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
                self.levelArray.removeAll();
                self.levelArray.push({inventoryCode: "", level: "", dispLevel: ""});
                ko.utils.arrayFilter(self.allInventory(),
                    function (r) {
                        if (r.chuName === chuName) {
                            self.shoArray.push(r);
                        }
                    })
           }

            self.selectShoList = function (data, event) {
                self.levelArray.removeAll();
                self.levelArray.push({inventoryCode: data.inventoryCode, level: 1, dispLevel: "1以上"}); 
                self.levelArray.push({inventoryCode: data.inventoryCode, level: 2, dispLevel: "2以上"}); 
                self.levelArray.push({inventoryCode: data.inventoryCode, level: 3, dispLevel: "3以上"}); 
                self.levelArray.push({inventoryCode: data.inventoryCode, level: 4, dispLevel: "4以上"}); 
            }

            self.selectLevel = function(level) {
                alert();
            }

            function distinctArray(array, item) {
                var tempArray = new Array();
                ko.utils.arrayForEach(array, function(r){
                    tempArray.push(r[item]);
                })
                return ko.utils.arrayGetDistinctValues(tempArray);
            }
            // self.filteredallInventory = ko.computed(function () {
            //     var filter = new Array();

            //     if (self.allInventory().length !== 0) {
            //         if (self.nameSearch().length === 0)
            //         {
            //             filter = self.allInventory();
            //         } else {
            //             ko.utils.arrayFilter(self.allInventory(),
            //                     function (r) {
            //                         var token = self.nameSearch().toLowerCase();
            //                         if (r.shoName.toLowerCase().indexOf(token) >= 0) {
            //                             filter.push(r);
            //                         }
            //                     });
            //         }
            //     }

            //     self.ready(true);
            //     return filter;
            // });

        }
        return inventorySearchViewModel;
    }
)
