define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable', 'ojs/ojarraytabledatasource'], 
    function (oj, ko, $) {
        function ExamListViewModel() {
            var self = this;
            var url = 'http://localhost:8080/skill/exams/2917';
            self.data = ko.observableArray();
            $.getJSON(url).then(function(exams) {
                $.each(exams, function() {
                    self.data.push({
                        examName: this.examName,
                        examGroup: this.examGroup,
                        qualifyDate: this.qualifyDate
                    });
                });
            });
            self.dataSource = new oj.ArrayTableDataSource(
                self.data
            );
        }
        return ExamListViewModel;
    }
);

