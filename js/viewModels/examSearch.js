define(['ojs/ojcore', 'knockout', 'jquery', 'common', 'ojs/ojtable'],
    function (oj, ko, $, common)
    {
        function searchViewModel() {
            var self = this;
            self.allExam = ko.observableArray([]);
            self.ready = ko.observable(false);
            self.nameSearch = ko.observable('');
            self.isLoading = ko.observable(true);

            var url = common.contextUrl + 'exams';
            $.getJSON(url).then(function(exams) {
                $.each(exams, function() {
                    self.allExam.push({
                        examName: this.examName,
                        examGroup: this.examGroup
                    })
                });
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
