define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojtable'],
    function (oj, ko, $)
{
        function testViewModel() {
            self = this;
            self.testText = ko.observable('未クリック');

            self.clickHandle = function() {
                self.testText('クリック済み');
                return true;
            }

        }
        return testViewModel;
    }
)
