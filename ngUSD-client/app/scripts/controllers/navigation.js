/**
 * Created with JetBrains WebStorm.
 * User: ngUSD
 * Date: 6/17/13
 * Time: 1:44 PM
 * To change this template use File | Settings | File Templates.
 */

function NavigationCtrl($scope, BranchService) {
    $scope.branches = BranchService.findAllBranches();
}