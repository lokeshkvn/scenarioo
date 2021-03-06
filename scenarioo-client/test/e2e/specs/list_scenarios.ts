'use strict';

import { scenario, step, useCase } from 'scenarioo-js';
import * as Utils from '../util';
import HomePage from '../pages/homePage';
import UsecasePage from '../pages/usecasePage';
import ScenarioPage from '../pages/scenarioPage';
import NavigationPage from '../pages/navigationPage';

const NUMBER_OF_USE_CASES = 4;
const NUMBER_OF_SCENARIOS = 4;
const COMPARISON_PROJECTSTART = 'To Projectstart';
const SECOND_USE_CASE = 1;
const SCENARIO_WITH_HIGHEST_DIFF = 'Find page title unique directly';

useCase('List scenarios')
    .description('After clicking on a use case, the user is presented with a list of all scenarios in this use case.')
    .describe(() => {

        beforeEach(async () => {
            await Utils.startScenariooRevisited();
        });

        scenario('Expand all, collapse all on scenario page')
            .it(async () => {
                await HomePage.goToPage();
                await step('select a use case from the use case list');
                await HomePage.assertPageIsDisplayed();
                await HomePage.assertUseCasesShown(NUMBER_OF_USE_CASES);
                await HomePage.selectUseCase(SECOND_USE_CASE);
                await step('select a scenario in the scenario list');
                await UsecasePage.selectScenario(0);
                await step('all pages are collapsed by default, "expand all" button is visible');
                await ScenarioPage.expectOnlyExpandAllButtonIsDisplayed();
                await ScenarioPage.toggleShowAllStepsOfPage(0);
                await step('"expand all" button and "collapse all" button are both visible');
                await ScenarioPage.expectExpandAllAndCollapseAllButtonBothDisplayed();
                await ScenarioPage.toggleShowAllStepsOfPage(1);
                await step('Only "collapse all" visible');
                await ScenarioPage.expectOnlyCollapseAllButtonIsDisplayed();
            });

        scenario('Display Diff-Information')
            .labels(['diff-viewer'])
            .it(async () => {
                await HomePage.goToPage();
                await step('display usecases on homepage');
                await HomePage.assertPageIsDisplayed();
                await NavigationPage.chooseComparison(COMPARISON_PROJECTSTART);
                await step('To Projectstart comparison selected');
                await HomePage.selectUseCase(SECOND_USE_CASE);
                await step('Use Case selected');

                await UsecasePage.assertNumberOfDiffInfos(NUMBER_OF_SCENARIOS);
                await NavigationPage.disableComparison();
            });

        scenario('Sort by Diff-Information')
            .labels(['diff-viewer'])
            .it(async () => {
                await HomePage.goToPage();
                await step('display usecases on homepage');
                await HomePage.assertPageIsDisplayed();
                await NavigationPage.chooseComparison('To Projectstart');
                await step('To Projectstart comparison selected');
                await HomePage.selectUseCase(SECOND_USE_CASE);
                await step('Use Case selected');

                await UsecasePage.sortByChanges();
                await UsecasePage.assertLastUseCase(SCENARIO_WITH_HIGHEST_DIFF);
                await step('Diff Infos sorted ascending');

                await UsecasePage.sortByChanges();
                await UsecasePage.assertFirstUseCase(SCENARIO_WITH_HIGHEST_DIFF);
                await step('Diff Infos sorted descending');
                await NavigationPage.disableComparison();
            });
    });
