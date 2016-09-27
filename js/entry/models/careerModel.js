var CareerModel = (function () {
  var contextUrl = 'http://172.16.9.99/rest/employees/';
  // var contextUrl = 'http://localhost:8080/skill/employees/';
  function CareerModel() {
    this.contextUrl = contextUrl;
  }
  
  // 挿入処理
  CareerModel.prototype.insert = function(employeeCode, career) {
    var url = contextUrl + employeeCode + '/careers';
    return $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(career),
        contentType: 'application/json',
        dataType: 'json'
    })
  }
                
  // 更新処理
  CareerModel.prototype.update = function(employeeCode, careerNumber, career) {
    var url = contextUrl + employeeCode + '/careers/' + careerNumber;
    return $.ajax({
        url: url,
        type: 'PUT',
        data: JSON.stringify(career),
        contentType: 'application/json',
        dataType: 'json'
    });
  }

  // 削除処理
  CareerModel.prototype.delete = function (employeeCode, careerNumber) {
    var url = contextUrl + employeeCode + '/careers/' + careerNumber;
    return $.ajax({
        url: url,
        type: 'DELETE',
        contentType: 'application/json'
    })
  };

  return CareerModel;
})();