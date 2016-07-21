define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable'],
    function (oj, ko, $)
    {
        function searchViewModel() {
            var self = this;
            self.allExam = ko.observableArray([]);
            self.ready = ko.observable(false);
            self.nameSearch = ko.observable('');

            // var url = 'http://localhost:8080/skill/exams';
            var url = 'js/test/exams.json';
            $.getJSON(url).then(function(exams) {
                $.each(exams, function() {
                    if (this.examSaimoku == null) {
                        self.allExam.push({
                            examName: this.examName,
                            examGroup: this.examGroup,
                            examSaimoku: ""
                        });
                    } else {
                        self.allExam.push({
                            examName: this.examName,
                            examGroup: this.examGroup,
                            examSaimoku: this.examSaimoku
                        });
                    }
                });
            });
            

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