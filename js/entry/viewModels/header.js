define(['ojs/ojcore', 'knockout', 'jquery'],
    function (oj, ko, $)
    {
        function headerViewModel() {
            var self = this;
            self.titleLabel = ko.observable("スキル可視化");

            self.menuItemSelect = function(event, ui) {
                window.location.href = ui.item.children("a")[0].href;
            }

            self.showHome = function() {
                window.location.href = "/";
            }
        }
        return headerViewModel;
    }
)
