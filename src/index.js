var qlik = window.require('qlik');
var $ = window.require('jquery');
import initialProperties from './initial-properties.js';
import template from './template.html';
import definition from './definition.js';
import controller from './controller.js';
import localCSS from './style.css'; // eslint-disable-line no-unused-vars

export default {
  initialProperties: initialProperties,
  template: template,
  definition: definition,
  controller: controller,
  support: {
    snapshot: false,
    export: false,
    exportData: false
  },
  paint: function ($element, layout) {
    const $scope = this.$scope;
    this.$scope.isInEdit = this.options.interactionState == 2;
    $scope.mobileMode = this.options.layoutMode == 7;
    //Display welcome message
    $scope.init = false;


    if (layout.mobile.switch && $scope.mobileMode) {
      $(`div[tid= "${layout.qInfo.qId}"]`).hide();
    } else {
      $(`div[tid= "${layout.qInfo.qId}"]`).show();
    }

    if (layout.alternatives.length == 0) {
      $scope.init = true;
    }
    var app = qlik.currApp($scope);

    $scope.toggleButton = function (event) {
      var target = event.target || event.srcElement || event.currentTarget;
      var idAttr = target.attributes.id;
      var idVis = idAttr.nodeValue.split('~')[0];
      var idContainer = target.attributes.idCont.nodeValue;
      var indexContainerInAlternatives = layout.alternatives.length > idContainer.replace(/\D/g,'') ? idContainer.replace(/\D/g,'') : 0;
      app.visualization.get(idVis).then(function (vis) {
        if (!layout.alternatives[indexContainerInAlternatives].toggleDataView) {
          vis.toggleDataView();
          layout.alternatives[indexContainerInAlternatives].toggleDataView = true;
        } else {
          layout.alternatives[indexContainerInAlternatives].toggleDataView = false;
        }
        vis.show(idContainer);
        vis.close();
      });
    };

    if (!this.$scope.alternatives) {
      this.$scope.alternatives = layout.alternatives;
    }

    this.$scope.qId = layout.qInfo.qId;
    return qlik.Promise.resolve();
  }
};
