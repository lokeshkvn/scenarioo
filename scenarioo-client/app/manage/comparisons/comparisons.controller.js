/* scenarioo-client
 * Copyright (C) 2014, scenarioo.org Development Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

angular.module('scenarioo.controllers').controller('ComparisonsController', ComparisonsController);

function ComparisonsController($scope, $uibModal, ComparisonsResource, ComparisonStatusMapperService) {

    var vm = this;

    vm.comparisons = [];
    vm.table = {search: {searchTerm: ''}, sort: {column: 'date', reverse: true}, filtering: false};
    $scope.table = vm.table; // expose "table" onto controller scope. is used at the moment by "sortableColumn" directive.

    vm.resetSearchField = resetSearchField;
    vm.getStyleClassForComparisonStatus = ComparisonStatusMapperService.getStyleClassForComparisonStatus;
    vm.showComparisonDetails = showComparisonDetails;

    activate();

    function activate() {
        ComparisonsResource.query({}, function(comparisons) {
            vm.comparisons = comparisons;
        });
    }

    function resetSearchField() {
        vm.table.search = {searchTerm: ''};
    }

    function showComparisonDetails(comparison) {
        $uibModal.open({
            template: require('./comparisonDetails.html'),
            controller: 'ComparisonDetailsController',
            controllerAs: 'vm',
            windowClass: 'modal-wide',
            resolve: {
                comparison: function () {
                    return comparison;
                },
                log: function () {
                    return "This is some test log";
                }
            }
        });
    }
}


