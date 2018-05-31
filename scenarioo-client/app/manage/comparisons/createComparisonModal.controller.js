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

angular.module('scenarioo.controllers').controller('CreateComparisonModalController', CreateComparisonModalController);

function CreateComparisonModalController($uibModalInstance, BranchesAndBuildsService, BuildDiffInfosResource, ComparisonCreateResource) {

    var vm = this;

    vm.branchesAndBuilds = {};
    vm.comparisonName = '';
    vm.baseBranch = null;
    vm.baseBuild = null;
    vm.comparisonBranch = null;
    vm.comparisonBuild = null;
    vm.validationMessage = null;

    vm.validateComparisonName = validateComparisonName;
    vm.setBaseBranch = setBaseBranch;
    vm.setBaseBuild = setBaseBuild;
    vm.setComparisonBranch = setComparisonBranch;
    vm.setComparisonBuild = setComparisonBuild;

    vm.cancel = cancel;
    vm.createComparison = createComparison;

    activate();

    function activate() {
        BranchesAndBuildsService.getBranchesAndBuilds().then(function onSuccess(branchesAndBuilds) {
            vm.branchesAndBuilds = branchesAndBuilds;
            vm.baseBranch = branchesAndBuilds.selectedBranch;
            vm.baseBuild = branchesAndBuilds.selectedBuild;
            loadComparisonsOfCurrentBuild();
        });
    }

    function loadComparisonsOfCurrentBuild() {
        var baseBranchName = vm.baseBranch.branch.name;
        var baseBuildName = vm.baseBuild.linkName;
        BuildDiffInfosResource.query(
            {'baseBranchName': baseBranchName, 'baseBuildName': baseBuildName},
            function onSuccess(buildDiffInfos) {
                vm.comparisonsOfCurrentBuild = buildDiffInfos;
                validateDistinctBuilds();
            }, function onFailure() {
                vm.comparisonsOfCurrentBuild = [];
                validateDistinctBuilds();
            }
        )
    }

    function setBaseBranch(branch) {
        vm.baseBranch = branch;
        vm.baseBuild = null;
        vm.comparisonsOfCurrentBuild = [];
        vm.validationMessage = null;
    }

    function setBaseBuild(build) {
        vm.baseBuild = build;
        validateBaseBuild();
        loadComparisonsOfCurrentBuild();
    }

    function setComparisonBranch(branch) {
        vm.comparisonBranch = branch;
        vm.comparisonBuild = null;
        vm.validationMessage = null;
    }

    function setComparisonBuild(build) {
        vm.comparisonBuild = build;
        validateComparisonBuild();
    }

    function validateComparisonName() {
        if (!vm.comparisonName || vm.comparisonName === '') {
            vm.validationMessage = 'Please enter a comparison name!';
            return false;
        } else {
            // Check for unique comparison name
            vm.validationMessage = null;
            vm.comparisonsOfCurrentBuild.forEach(function (comparison) {
                if (comparison.name == vm.comparisonName) {
                    vm.validationMessage = 'Comparison with that name already exists on selected target build'
                }
            });
            return !vm.validationMessage;
        }
    }

    function validateBaseBuild() {
        if (!vm.baseBranch || !vm.baseBuild) {
            vm.validationMessage = 'Please choose target branch and build to compare!';
            return false;
        } else if (vm.comparisonBuild) {
            return validateDistinctBuilds();
        } else {
            vm.validationMessage = null;
            return true;
        }
    }

    function validateComparisonBuild() {
        if (!vm.comparisonBranch || !vm.comparisonBuild) {
            vm.validationMessage = 'Please choose branch and build to compare with!';
            return false;
        } else if (vm.baseBuild) {
            return validateDistinctBuilds();
        } else {
            vm.validationMessage = null;
            return true;
        }
    }

    function validateDistinctBuilds() {
        if (vm.baseBuild && vm.comparisonBuild) {
            if (vm.baseBranch.branch.name === vm.comparisonBranch.branch.name && vm.baseBuild.build.name === vm.comparisonBuild.build.name) {
                vm.validationMessage = 'Please choose two distinct builds to compare!';
                return false;
            } else {
                return validateSelectedComparisonNotYetExists();
            }
        }
    }

    function validateSelectedComparisonNotYetExists() {
        vm.validationMessage = null;
        vm.comparisonsOfCurrentBuild.forEach(function (comparison) {
            if (isEqualBuild(comparison.baseBuild, vm.baseBranch, vm.baseBuild) && isEqualBuild(comparison.compareBuild, vm.comparisonBranch, vm.comparisonBuild)) {
                vm.validationMessage = 'Comparison of selected builds already exists!';
            }
        });
        return !vm.validationMessage;
    }

    function isEqualBuild(buildIdentifier, branch, build) {
        // if it is an alias, the name is somehow stored in the description field (very dirty, but that is how it currently is)
        var branchNameToCompare = branch.isAlias ? branch.branch.description : branch.branch.name;
        return buildIdentifier.branchName === branchNameToCompare && buildIdentifier.buildName === build.build.name;
    }

    function validateAllFields() {
        return validateComparisonName() && validateBaseBuild() && validateComparisonBuild();
    }

    function isValidInput() {
        // if there is no message the user can click on create - but this might trigger revalidation, which might still block him!
        return !vm.validationMessage;
    }

    function createComparison() {

        validateAllFields();

        if (!isValidInput()) {
            return;
        }

        ComparisonCreateResource.post({
            branchName: vm.baseBranch.branch.name,
            buildName: vm.baseBuild.build.name,
            comparisonName: vm.comparisonName
        }, {
                branchName: vm.comparisonBranch.branch.name,
                buildName: vm.comparisonBuild.build.name
        }, onSuccessCreation, onFailedCreation);

    }

    function onSuccessCreation() {
        $uibModalInstance.close();
    }

    function onFailedCreation() {
        vm.validationMessage = 'Creation of new comparison failed for unknown reason.';
        // keeps the modal open for showing the error.
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}


