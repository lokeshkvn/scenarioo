/* scenarioo-server
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

package org.scenarioo.model.configuration;

import org.codehaus.jackson.annotate.JsonIgnore;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * The configuration for the server and the client.
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Configuration {

	public static final String DEFAULT_ALIAS_FOR_MOST_RECENT_BUILD = "most recent";
	public static final String DEFAULT_ALIAS_FOR_LAST_SUCCESSFUL_BUILD = "last successful";

	private String defaultBranchName = "trunk";

	private String defaultBuildName = DEFAULT_ALIAS_FOR_LAST_SUCCESSFUL_BUILD;

	private String aliasForMostRecentBuild = DEFAULT_ALIAS_FOR_MOST_RECENT_BUILD;

	private String aliasForLastSuccessfulBuild = DEFAULT_ALIAS_FOR_LAST_SUCCESSFUL_BUILD;

	private String buildStatusForSuccessfulBuilds = "success";

	private String scenarioPropertiesInOverview;

	private String elasticSearchEndpoint = "localhost:9300";

	private String elasticSearchClusterName = "elasticsearch";

	private String applicationName = "";

	private String applicationInformation = "";

	/**
	 * The order of the branch entries in the top level navigation branch selection dropdown is configurable.
	 * Values: name-ascending, name-descending, last-build-date-descending
	 */
	private String branchSelectionListOrder = "name-ascending";

	private Map<String, String> buildstates = new HashMap<String, String>();

	/**
	 * RGB Hex Color
	 * Pattern: 0xAARRGGBB <br/>
	 * - AA: ALPHA. Transparency. Range from hex 00..ff <br />
	 * - RR: RED. Range from hex 00..ff <br />
	 * - GG: GREEN. Range from hex 00..ff <br />
	 * - BB: BLUE. Range from hex 00..ff <br />
	 *
	 * @see <a href="https://docs.oracle.com/javase/7/docs/api/java/awt/Color.html#Color(int,%20boolean)"> docs.oracle.com</a>
	 */
	private String diffImageColor = "0x7fff7e00";

	/**
	 * Will create a physical build containing the last successful scenarios of a branch.
	 */
	private boolean createLastSuccessfulScenarioBuild = false;

	/**
	 * Should pages be expanded by default in the scenario overview page for one scenario?
	 */
	private boolean expandPagesInScenarioOverview = false;

	@XmlElementWrapper(name = "branchAliases")
	@XmlElement(name = "branchAlias")
	private List<BranchAlias> branchAliases = new LinkedList<BranchAlias>();

	@XmlElementWrapper(name = "comparisonConfigurations")
	@XmlElement(name = "comparisonConfiguration")
	private List<ComparisonConfiguration> comparisonConfigurations = new LinkedList<ComparisonConfiguration>();

	private Map<String, LabelConfiguration> labelConfigurations = new LinkedHashMap<String, LabelConfiguration>();

	private List<CustomObjectTab> customObjectTabs = new ArrayList<CustomObjectTab>();

	public String getDefaultBranchName() {
		return defaultBranchName;
	}

	public void setDefaultBranchName(final String defaultBranchName) {
		this.defaultBranchName = defaultBranchName;
	}

	public String getDefaultBuildName() {
		return defaultBuildName;
	}

	public void setDefaultBuildName(final String defaultBuildName) {
		this.defaultBuildName = defaultBuildName;
	}

	public String getAliasForMostRecentBuild() {
		return aliasForMostRecentBuild;
	}

	public void setAliasForMostRecentBuild(final String aliasForMostRecentBuild) {
		this.aliasForMostRecentBuild = aliasForMostRecentBuild;
	}

	public String getAliasForLastSuccessfulBuild() {
		return aliasForLastSuccessfulBuild;
	}

	public void setAliasForLastSuccessfulBuild(final String aliasForLastSuccessfulBuild) {
		this.aliasForLastSuccessfulBuild = aliasForLastSuccessfulBuild;
	}

	public String getBuildStatusForSuccessfulBuilds() {
		return buildStatusForSuccessfulBuilds;
	}

	public void setBuildStatusForSuccessfulBuilds(final String buildStatusForSuccessfulBuilds) {
		this.buildStatusForSuccessfulBuilds = buildStatusForSuccessfulBuilds;
	}

	public String getScenarioPropertiesInOverview() {
		return scenarioPropertiesInOverview;
	}

	public void setScenarioPropertiesInOverview(final String scenarioPropertiesInOverview) {
		this.scenarioPropertiesInOverview = scenarioPropertiesInOverview;
	}

	public String getElasticSearchEndpoint() {
		return elasticSearchEndpoint;
	}

	public void setElasticSearchEndpoint(String elasticSearchEndpoint) {
		this.elasticSearchEndpoint = elasticSearchEndpoint;
	}

	public String getElasticSearchClusterName() {
		return elasticSearchClusterName;
	}

	public void setElasticSearchClusterName(String elasticSearchClusterName) {
		this.elasticSearchClusterName = elasticSearchClusterName;
	}

	public String getApplicationName() {
		return applicationName;
	}

	/**
	 * The name of the application that is documented by this Scenarioo installation. It's displayed in the browser's
	 * title bar and in the navigation bar of Scenarioo.
	 */
	public void setApplicationName(final String applicationName) {
		this.applicationName = applicationName;
	}

	public String getApplicationInformation() {
		return applicationInformation;
	}

	public void setApplicationInformation(final String applicationInformation) {
		this.applicationInformation = applicationInformation;
	}

	public String getBranchSelectionListOrder() {
		return branchSelectionListOrder;
	}

	public void setBranchSelectionListOrder(String branchSelectionListOrder) {
		this.branchSelectionListOrder = branchSelectionListOrder;
	}

	public Map<String, String> getBuildstates() {
		return buildstates;
	}

	public void setBuildstates(final Map<String, String> buildstates) {
		this.buildstates = buildstates;
	}

	public boolean isExpandPagesInScenarioOverview() {
		return expandPagesInScenarioOverview;
	}

	public void setExpandPagesInScenarioOverview(final boolean expandPagesInScenarioOverview) {
		this.expandPagesInScenarioOverview = expandPagesInScenarioOverview;
	}

	public List<BranchAlias> getBranchAliases() {
		if (branchAliases == null) {
			branchAliases = new LinkedList<BranchAlias>();
		}
		return branchAliases;
	}

	public void setBranchAliases(final List<BranchAlias> buildAliases) {
		this.branchAliases = buildAliases;
	}

	public List<ComparisonConfiguration> getComparisonConfigurations() {
		return comparisonConfigurations;
	}

	public void setComparisonConfigurations(final List<ComparisonConfiguration> comparisonConfigurations) {
		this.comparisonConfigurations = comparisonConfigurations;
	}

	public Map<String, LabelConfiguration> getLabelConfigurations() {
		if (labelConfigurations == null) {
			labelConfigurations = new LinkedHashMap<String, LabelConfiguration>();
		}
		return labelConfigurations;
	}

	public void setLabelConfigurations(final Map<String, LabelConfiguration> labelConfigurations) {
		this.labelConfigurations = labelConfigurations;
	}

	public List<CustomObjectTab> getCustomObjectTabs() {
		return customObjectTabs;
	}

	public void setCustomObjectTabs(final List<CustomObjectTab> customObjectTabs) {
		this.customObjectTabs = customObjectTabs;
	}

	public boolean isCreateLastSuccessfulScenarioBuild() {
		return createLastSuccessfulScenarioBuild;
	}

	public void setCreateLastSuccessfulScenarioBuild(final boolean createLastSuccessfulScenarioBuild) {
		this.createLastSuccessfulScenarioBuild = createLastSuccessfulScenarioBuild;
	}

	public String getDiffImageColor() {
		return diffImageColor;
	}

	public void setDiffImageColor(String color) {
		this.diffImageColor = color;
	}

	@JsonIgnore
	public Color getDiffImageAwtColor() {
		//Required Long. Because the positive hex value could be out of range of a signed integer. With Long we can avoid this issue.
		int rgba = Long.decode(diffImageColor).intValue();
		return new Color(rgba, true);
	}

	@JsonIgnore
	public void setDiffImageAwtColor(Color diffColor) {
		this.diffImageColor = "0x" + Integer.toHexString(diffColor.getRGB());
	}
}
