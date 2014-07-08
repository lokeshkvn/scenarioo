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

'use strict';

angular.module('scenarioo.controllers').controller('ReferenceTreeCtrl', function ($rootScope, $scope, 
    $routeParams, $location, ObjectIndexListResource, PagesAndSteps, SelectedBranchAndBuild, ScenarioResource) {

    var objectType = $routeParams.objectType;
    var objectName = $routeParams.objectName;
    var selectedBranchAndBuild;

    $scope.referenceTree = [];
    $scope.locationPath;

    $scope.treemodel;

    // Determines if the tree has expanded / collapsed rootnodes initially
    $scope.rootIsCollapsed = false;
    $scope.toggleLabel = 'collapse';  
    $scope.collapsedIconName = 'collapsed.png';
    $scope.expandedIconName= 'expanded.png';  

    SelectedBranchAndBuild.callOnSelectionChange(loadReferenceTree);

    function loadReferenceTree(selected) {
    selectedBranchAndBuild = selected;

    ObjectIndexListResource.get(
        {
            branchName: selected.branch,
            buildName: selected.build,
            // Mocked until #216 will be implemented
            objectType: 'page',             // objectType,
            objectName: 'searchResults.jsp' // objectName
        },
        function(result) {
            $scope.referenceTree = result;
        });
	}

    $scope.goToRelatedView = function(nodeElement) {
        // TODO: set usecasename and scenarioName dynamically

        ScenarioResource.get(
        {
            branchName: selectedBranchAndBuild.branch,
            buildName: selectedBranchAndBuild.build,
            usecaseName: 'Find Page',
            scenarioName: 'find_page_no_result'
        },
        function(result) {
            // TODO: type could be also 'Feature' or something else, which
            // view shall be displayed for that??

            $scope.locationPath = '/' + nodeElement.type + '/*';
            var pagesAndSteps;
            var pageStepIndexes;

            switch(nodeElement.type) {
                case "case":
                    concatLocationPath(nodeElement);
                    break;
                case "scenario":
                    concatLocationPath(nodeElement);
                    break;
                case "page":
                case "step":
                    $scope.locationPath = '/step/*';                
                    concatLocationPath(nodeElement);
                    pagesAndSteps = $rootScope.populatePageAndSteps(result);
                    pageStepIndexes = getPageAndStepIndex('searchResults.jsp', pagesAndSteps);

                    // In step.js will pageIndex incremented by 1, therefore we have to subtract 1
                    // TODO: This should be fixed in the future, so that the server returns the right number.
                    $scope.locationPath += '/' + (pageStepIndexes[0].page -1 )+ '/' + pageStepIndexes[0].step
                    break;
            }

        $scope.locationPath = $scope.locationPath.replace('/*', '');
        $location.path($scope.locationPath);
        })
    };

    function getPageAndStepIndex(pageName, pagesAndSteps) {
        var result = [];

        angular.forEach(pagesAndSteps.pagesAndSteps, function (value, index) {
           if (value.page.name == pageName) {
                result = [{page: value.page.index, step: value.steps[0].index}];
            }
        });
        
        return result;
    }

    function concatLocationPath(nodeElement) {
        if (angular.isDefined(nodeElement) && nodeElement.level != 0) {
            $scope.locationPath = $scope.locationPath.replace('*', '*/' + encodeURIComponent(nodeElement.name));
            concatLocationPath(nodeElement.parent, $scope.locationPath);
        }
    };

    $scope.toggleTree = function(treemodel) {
        angular.forEach(treemodel, function(node, index) {
            if ($scope.rootIsCollapsed && node.level != 0) {
                node.isCollapsed = !$scope.rootIsCollapsed;            
                node.isVisible = $scope.rootIsCollapsed;
                node.icon = node.isCollapsed ? $scope.expandedIconName : $scope.collapsedIconName;                  
                $scope.toggleLabel = 'collapse';
            }
            else if (node.level != 0) {
                node.isCollapsed = !$scope.rootIsCollapsed;            
                node.isVisible = $scope.rootIsCollapsed;
                node.icon = node.isCollapsed ? $scope.expandedIconName : $scope.collapsedIconName;                  
                $scope.toggleLabel = 'expand';
            }

            if (node.level == 0) {
                node.icon = node.isCollapsed ? $scope.collapsedIconName: $scope.expandedIconName;                  
                node.isCollapsed = !$scope.rootIsCollapsed;
            }
        })

        $scope.rootIsCollapsed = !$scope.rootIsCollapsed;
    }

    $scope.resetSearchField = function() {
        $scope.searchField = '';
    }
});