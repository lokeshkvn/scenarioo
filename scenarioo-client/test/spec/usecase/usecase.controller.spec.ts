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
import * as angular from 'angular';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';


describe('UseCaseController', function () {

    const BRANCH = 'branch_123',
        BUILD = 'build_123',
        USE_CASE = 'LogIn';

    let $scope, routeParams, controller, ScenarioResource, UseCaseDiffInfoResource, ScenarioDiffInfosResource,
        SelectedBranchAndBuildService, $location, RelatedIssueResource;
    let labelConfigurationService: any;

    beforeEach(angular.mock.module('scenarioo.controllers'));

    beforeEach(inject(function ($rootScope, $routeParams, $controller, _ScenarioResource_, _RelatedIssueResource_, _UseCaseDiffInfoResource_, _ScenarioDiffInfosResource_,
                                ConfigMock, _SelectedBranchAndBuildService_, _$location_, LocalStorageService) {
            $scope = $rootScope.$new();
            routeParams = $routeParams;
            routeParams.useCaseName = USE_CASE;
            ScenarioResource = _ScenarioResource_;
            RelatedIssueResource = _RelatedIssueResource_;
            UseCaseDiffInfoResource = _UseCaseDiffInfoResource_;
            ScenarioDiffInfosResource = _ScenarioDiffInfosResource_;
            SelectedBranchAndBuildService = _SelectedBranchAndBuildService_;
            labelConfigurationService = {
                get(): Observable<any> {
                    return Observable.of({});
                }
            };

            $location = _$location_;

            LocalStorageService.clearAll();

            controller = $controller('UseCaseController', {
                $scope: $scope,
                $routeParams: routeParams,
                ConfigService: ConfigMock,
                ScenarioResource: ScenarioResource,
                RelatedIssueResource: RelatedIssueResource,
                UseCaseDiffInfoResource: UseCaseDiffInfoResource,
                ScenarioDiffInfosResource: ScenarioDiffInfosResource,
                SelectedBranchAndBuildService: SelectedBranchAndBuildService,
                labelConfigurationService
            });
        }
    ));

    it('should load all scenarios and and the selected use case', function () {
        spyOn(ScenarioResource, 'get').and.callFake(getFindAllScenariosFake());
        spyOn(RelatedIssueResource, 'query').and.callFake(queryRelatedIssuesFake());
        spyOn(UseCaseDiffInfoResource, 'get').and.callFake(getEmptyData());
        spyOn(ScenarioDiffInfosResource, 'get').and.callFake(getEmptyData());

        expect(SelectedBranchAndBuildService.selected().branch).toBeUndefined();
        expect(SelectedBranchAndBuildService.selected().build).toBeUndefined();

        $location.url('/new/path/?branch=' + BRANCH + '&build=' + BUILD);
        $scope.$apply();

        expect(SelectedBranchAndBuildService.selected().branch).toBe(BRANCH);
        expect(SelectedBranchAndBuildService.selected().build).toBe(BUILD);

        $scope.$apply();

        expect(ScenarioResource.get).toHaveBeenCalledWith({
            'branchName': BRANCH,
            'buildName': BUILD,
            'usecaseName': USE_CASE
        }, jasmine.any(Function));
        expect(controller.useCase).toBeDefined();
        expect(controller.scenarios).toBeDefined();
        expect(controller.propertiesToShow).toBeDefined();
    });

    function getFindAllScenariosFake() {
        const DATA = {
            useCase: 'useCase',
            scenarios: getFakeScenarios()
        };

        return function (params, onSuccess) {
            onSuccess(DATA);
        };
    }

    function queryRelatedIssuesFake() {
        const DATA = {
            0:
                {
                    id: '1',
                    name: 'fakeTestingIssue',
                    firstScenarioSketchId: '1'
                }
        };

        return function (params, onSuccess) {
            onSuccess(DATA);
        };
    }

    function getFakeScenarios() {
        const scenarios = [];
        scenarios.push({
            name: 'scenario'
        });
        return scenarios;
    }

    function getEmptyData() {
        const DATA = {};

        return function (params, onSuccess) {
            onSuccess(DATA);
        };
    }

});
