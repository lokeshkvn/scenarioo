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

angular.module('scenarioo.controllers').controller('UseCaseController', UseCaseController);

function UseCaseController($scope, $filter, $routeParams, $location, ScenarioResource, ConfigService,
                           SelectedBranchAndBuildService, SelectedComparison, DiffInfoService, LabelConfigurationsResource, RelatedIssueResource,
                           SketchIdsResource, UseCaseDiffInfoResource, ScenarioDiffInfosResource) {

    var vm = this;

    vm.table = {
        search: {$: ''},
        sort: {
            column: 'scenario.name',
            reverse: false
        }
    };
    $scope.table = vm.table; // expose "table" onto controller scope. is used at the moment by "sortableColumn" directive.
    vm.propertiesToShow = [];
    vm.labelConfigurations = {};
    vm.useCase = {};
    vm.scenarios = [];
    vm.usecaseInformationTree = {};
    vm.metadataTree = {};
    vm.relatedIssues = {};
    vm.hasAnyLabels = false;
    $scope.comparisonInfo = null; // initialized later in activate,  should be defined on vm as well (Style Guide!)

    vm.resetSearchField = resetSearchField;
    vm.handleClick = handleClick;
    vm.goToFirstStep = goToFirstStep;
    vm.goToScenario = goToScenario;
    vm.onNavigatorTableHit = onNavigatorTableHit;
    vm.getLabelStyle = getLabelStyle;
    vm.goToIssue = goToIssue;

    activate();

    function activate() {
        SelectedBranchAndBuildService.callOnSelectionChange(loadScenariosAndUseCase);

        LabelConfigurationsResource.query({}, function (labelConfigurations) {
            vm.labelConfigurations = labelConfigurations;
        });
        $scope.comparisonInfo = SelectedComparison.info;
    }

    function resetSearchField() {
        vm.table.search = {searchTerm: ''};
    }

    function handleClick(useCaseName, scenarioSummary) {
        if(!scenarioSummary.diffInfo || !scenarioSummary.diffInfo.isRemoved){
            goToScenario(useCaseName, scenarioSummary.scenario.name);
        }
    }

    function goToScenario(useCaseName, scenarioName) {
        $location.path('/scenario/' + useCaseName + '/' + scenarioName);
    }

    function onNavigatorTableHit(scenario) {
        goToScenario($routeParams.useCaseName, scenario.scenario.name);
    }

    // FIXME this code is duplicated. How can we extract it into a service?
    function getLabelStyle(labelName) {
        var labelConfig = vm.labelConfigurations[labelName];
        if (labelConfig) {
            return {
                'background-color': labelConfig.backgroundColor,
                'color': labelConfig.foregroundColor
            };
        }
    }

    function goToFirstStep(useCaseName, scenarioName) {
        var selected = SelectedBranchAndBuildService.selected();

        // FIXME This could be improved, if the scenario service
        // for finding all scenarios would also retrieve the name of the first page
        ScenarioResource.get(
            {
                branchName: selected.branch,
                buildName: selected.build,
                usecaseName: useCaseName,
                scenarioName: scenarioName
            },
            function onSuccess(scenarioResult) {
                $location.path('/step/' + useCaseName + '/' + scenarioName + '/' + scenarioResult.pagesAndSteps[0].page.name + '/0/0');
            }
        );
    }

    function loadScenariosAndUseCase(selected) {
        var useCaseName = $routeParams.useCaseName;

        ScenarioResource.get({
            branchName: selected.branch,
            buildName: selected.build,
            usecaseName: useCaseName
        }, onUseCaseLoaded);
        vm.propertiesToShow = ConfigService.scenarioPropertiesInOverview();

    }

    function onUseCaseLoaded(result) {
        vm.useCase = result.useCase;
        vm.usecaseInformationTree = createUseCaseInformationTree(vm.useCase);
        vm.metadataTree = $filter('scMetadataTreeListCreator')(vm.useCase.details);
        vm.hasAnyLabels = vm.useCase.labels && vm.useCase.labels.label.length !== 0;

        if(SelectedComparison.isDefined()) {
            var selected = SelectedBranchAndBuildService.selected();
            loadDiffInfoData(result.scenarios, selected.branch, selected.build, SelectedComparison.selected(), result.useCase.name);
        } else {
            vm.scenarios = result.scenarios;
        }

        loadRelatedIssues();
    }

    function loadDiffInfoData(scenarios, baseBranchName, baseBuildName, comparisonName, useCaseName) {
        if (scenarios && baseBranchName && baseBuildName && useCaseName){
            UseCaseDiffInfoResource.get(
                {'baseBranchName': baseBranchName, 'baseBuildName': baseBuildName, 'comparisonName': comparisonName, 'useCaseName': useCaseName},
                function onSuccess(useCaseDiffInfo) {
                    ScenarioDiffInfosResource.get(
                        {'baseBranchName': baseBranchName, 'baseBuildName': baseBuildName, 'comparisonName': comparisonName, 'useCaseName': useCaseName},
                        function onSuccess(scenarioDiffInfos) {
                            vm.scenarios = DiffInfoService.getElementsWithDiffInfos(scenarios, useCaseDiffInfo.removedElements, scenarioDiffInfos, 'scenario.name');
                        }
                    );
                }, function onFailure() {
                    vm.scenarios = DiffInfoService.getElementsWithDiffInfos(scenarios, [], [], 'scenario.name');
                }
            );
        }
    }

    function loadRelatedIssues(){
        RelatedIssueResource.query({
            branchName: SelectedBranchAndBuildService.selected().branch,
            buildName: SelectedBranchAndBuildService.selected().build,
            useCaseName: $routeParams.useCaseName
        }, function(result){
            vm.relatedIssues = result;
            vm.hasAnyRelatedIssues = vm.relatedIssues.length > 0;
        });
    }

    function goToIssue(issue) {
        var selectedBranch = SelectedBranchAndBuildService.selected().branch;
        SketchIdsResource.get(
            {'branchName': selectedBranch, 'issueId': issue.id },
            function onSuccess(result) {
                $location.path('/stepsketch/' + issue.id + '/' + result.scenarioSketchId + '/' + result.stepSketchId);
            });
    }

    function createUseCaseInformationTree(usecase) {
        var usecaseInformation = {};
        usecaseInformation['Use Case'] = usecase.name;
        if(usecase.description) {
            usecaseInformation.Description = usecase.description;
        }
        usecaseInformation.Status = usecase.status;
        return $filter('scMetadataTreeCreator')(usecaseInformation);
    }

}
