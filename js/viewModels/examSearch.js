define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable'],
    function (oj, ko, $)
    {
        function searchViewModel() {
            var self = this;
            self.allExam = ko.observableArray([]);
            self.ready = ko.observable(false);
            self.nameSearch = ko.observable('');

            // var url = 'js/test/exams.json';
            var url = 'http://172.16.9.99/rest/exams';
            $.getJSON(url).then(function(exams) {
                $.each(exams, function() {
                    self.allExam.push({
                        examName: this.examName,
                        examGroup: this.examGroup
                    })
                });
            });
            
            /**
             * 資格の絞り込み
             */
            self.filteredallExam = ko.computed(function () {
                var examFilter = new Array();

                if (self.allExam().length !== 0) {
                    if (self.nameSearch().length === 0)
                    {
                        examFilter = self.allExam();
                    } else {
                        ko.utils.arrayFilter(self.allExam(),
                            function (r) {
                                var token = self.nameSearch().toLowerCase();
                                if (r.examName.toLowerCase().indexOf(token) >= 0) {
                                    examFilter.push(r);
                                }
                            });
                    }
                }

                self.ready(true);
                return examFilter;
            });
            self.dataSource = ko.computed(function () {
                return new oj.ArrayTableDataSource(self.filteredallExam());
            });
        }
        return searchViewModel;
    }
)
