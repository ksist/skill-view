define(['ojs/ojcore', 'knockout', 'jquery'],
    function (oj, ko, $)
    {
        function errorViewModel() {
            var self = this;
            var rootViewModel = ko.dataFor(document.getElementById('mainContent'));
            self.errorMessage = rootViewModel.errorMessage;

        }
        return errorViewModel;
    }
)
