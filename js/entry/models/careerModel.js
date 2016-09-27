var CareerModel = (function () {
  function CareerModel(contextUrl) {
    this.contextUrl = contextUrl + 'employees/';
  }
  
  // 挿入処理
  CareerModel.prototype.insert = function(employeeCode, career) {
    var url = this.contextUrl + employeeCode + '/careers';
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
    var url = this.contextUrl + employeeCode + '/careers/' + careerNumber;
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
    var url = this.contextUrl + employeeCode + '/careers/' + careerNumber;
    return $.ajax({
        url: url,
        type: 'DELETE',
        contentType: 'application/json'
    })
  };

  return CareerModel;
})();