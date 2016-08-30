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
            self.isLoading = ko.observable(true);

            /**
             * スキルズインベントリデータの取得
             */
            // var url = 'js/test/inventories.json';
            var url = 'http://172.16.9.99/rest/inventories'
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
            }).always(function() {
                self.isLoading(false);
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

            /**
             * 大項目選択時に呼ばれる
             * 中項目のリストを表示する
             */
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
                self.levelArray.push({inventoryCode: "", shoName: "", level: "", dispLevel: ""});
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

            /**
             * 中項目選択時に呼ばれる
             * 小項目のリストを表示する
             */
            self.selectChuList = function (chuName) {
                self.shoArray.removeAll();
                self.levelArray.removeAll();
                self.levelArray.push({inventoryCode: "", shoName: "", level: "", dispLevel: ""});
                ko.utils.arrayFilter(self.allInventory(),
                    function (r) {
                        if (r.chuName === chuName) {
                            self.shoArray.push(r);
                        }
                    })
           }

           /**
            * 小項目選択時に呼ばれる
            * レベルのリストを表示する
            */
            self.selectShoList = function (data, event) {
                self.levelArray.removeAll();
                self.levelArray.push({
                    inventoryCode: data.inventoryCode, 
                    shoName: data.shoName, 
                    level: 4, dispLevel: "4以上"
                }); 
                self.levelArray.push({
                    inventoryCode: data.inventoryCode, 
                    shoName: data.shoName, 
                    level: 3, dispLevel: "3以上"}); 
                self.levelArray.push({
                    inventoryCode: data.inventoryCode, 
                    shoName: data.shoName, 
                    level: 2, dispLevel: "2以上"
                }); 
                self.levelArray.push({
                    inventoryCode: data.inventoryCode, 
                    shoName: data.shoName, 
                    level: 1, dispLevel: "1以上"
                }); 
            }

            /**
             * 配列から重複しているものを除いた配列を返す
             * @param 重複しているかの判定をする項目
             * @return 重複を排除した配列
             */
            function distinctArray(array, item) {
                var tempArray = new Array();
                ko.utils.arrayForEach(array, function(r){
                    tempArray.push(r[item]);
                })
                return ko.utils.arrayGetDistinctValues(tempArray);
            }
        }
        return inventorySearchViewModel;
    }
)
