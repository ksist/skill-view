define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable'],
    function (oj, ko, $)
    {
        function searchViewModel() {
            var self = this;
            self.allExam = ko.observableArray([]);
            self.ready = ko.observable(false);
            self.nameSearch = ko.observable('');

            // var url = 'http://localhost:8080/skill/exams';
            var url = 'js/test/educations.json';
            $.getJSON(url).then(function(educations) {
                $.each(educations, function() {
                    self.allExam.push({
                        educationName: this.educationName,
                        educationCode: this.educationCode,
                        institute: this.institute
                    });
                });
            });
            

            self.filteredallExam = ko.computed(function () {
                var filter = new Array();

                if (self.allExam().length !== 0) {
                    if (self.nameSearch().length === 0)
                    {
                        filter = self.allExam();
                    } else {
                        ko.utils.arrayFilter(self.allExam(),
                                function (r) {
                                    var token = self.nameSearch().toLowerCase();
                                    if (r.educationName.toLowerCase().indexOf(token) >= 0) {
                                        filter.push(r);
                                    }
                                });
                    }
                }

                self.ready(true);
                return filter;
            });
            self.dataSource = ko.computed(function () {
                return new oj.ArrayTableDataSource(self.filteredallExam());
            });
        }
        return searchViewModel;
    }
)
