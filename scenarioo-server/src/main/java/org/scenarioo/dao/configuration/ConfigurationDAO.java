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

package org.scenarioo.dao.configuration;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.scenarioo.api.util.xml.ScenarioDocuXMLFileUtil;
import org.scenarioo.model.configuration.Configuration;
import org.scenarioo.model.configuration.CustomObjectDetailColumn;
import org.scenarioo.model.configuration.CustomObjectTab;

/**
 * DAO for accessing USD configuration data from filesysem.
 */
public class ConfigurationDAO {
	
	private static final Logger LOGGER = Logger
			.getLogger(ConfigurationDAO.class);
	
	private static String EXAMPLE_DOCUMENTATION_DIRECTORY = "documentationExample";
	
	private static final String USER_HOME_BASE_DIRECTORY = ".scenarioo";
	private static final String CONFIG_FILE_NAME = "config.xml";
	private static final String DEFAULT_CONFIG_PATH = CONFIG_FILE_NAME;
	
	private static Configuration configuration = null;
	
	private static String configurationDirectory = null;
	private static String configurationFilename = null;
	
	public static void setConfigurationDirectory(
			final String configurationDirectory) {
		ConfigurationDAO.configurationDirectory = configurationDirectory;
	}
	
	public static void setConfigurationFilename(
			final String configurationFilename) {
		ConfigurationDAO.configurationFilename = configurationFilename;
	}
	
	/**
	 * Only for testing
	 */
	public static void injectConfiguration(final Configuration configuration) {
		ConfigurationDAO.configuration = configuration;
	}
	
	public static Configuration getConfiguration() {
		if (configuration == null) {
			configuration = loadConfiguration();
		}
		return configuration;
	}
	
	static Configuration loadConfiguration() {
		File configFile = getFileSystemConfigFile();
		if (configFile == null || !configFile.exists()) {
			LOGGER.warn("  file "
					+ configFile
					+ " does not exist --> loading default config.xml from classpath");
			configFile = getClasspathConfigFile();
		} else {
			LOGGER.info("  loading configuration from file: " + configFile);
		}
		return ScenarioDocuXMLFileUtil.unmarshal(Configuration.class,
				configFile);
	}
	
	public static Configuration updateConfiguration(
			final Configuration configuration) {
		final File configFile = getFileSystemConfigFile();
		final File configDirectory = configFile.getParentFile();
		configDirectory.mkdirs();
		ScenarioDocuXMLFileUtil.marshal(configuration, configFile);
		ConfigurationDAO.configuration = loadConfiguration();
		return configuration;
	}
	
	/**
	 * Get the place where customized configuration file is or will be stored (as soon as first configuration change has
	 * been applied).
	 */
	private static File getFileSystemConfigFile() {
		File configurationPath;
		if (!StringUtils.isBlank(configurationDirectory)) {
			configurationPath = new File(configurationDirectory);
		} else {
			LOGGER.warn("no configuration directory is configuresd in server context, therefore trying to use fallback directory in user home.");
			configurationPath = getUserHomeConfigurationDirectory();
		}
		if (configurationPath == null) {
			return null;
		}
		File configFile;
		if (StringUtils.isNotBlank(configurationFilename)) {
			configFile = new File(configurationPath, configurationFilename);
		} else {
			configFile = new File(configurationPath, CONFIG_FILE_NAME);
		}
		return configFile;
	}
	
	private static File getUserHomeConfigurationDirectory() {
		File configurationPath;
		// file constructor handles null or blank user.home
		configurationPath = new File(System.getProperty("user.home"),
				USER_HOME_BASE_DIRECTORY);
		
		return configurationPath;
	}
	
	private static File getClasspathConfigFile() {
		final URL resourceUrl = ConfigurationDAO.class.getClassLoader()
				.getResource(DEFAULT_CONFIG_PATH);
		File defaultConfigFile = null;
		try {
			defaultConfigFile = new File(resourceUrl.toURI());
		} catch (final URISyntaxException e) {
			throw new IllegalStateException(
					"Default configuration file is not accessable.", e);
		}
		if (defaultConfigFile == null || !defaultConfigFile.exists()) {
			throw new IllegalStateException(
					"Default configuration file is missing.");
		}
		return defaultConfigFile;
	}
	
	public static File getDocuDataDirectoryPath() {
		if (StringUtils.isBlank(configuration.getTestDocumentationDirPath())) {
			final URL exampleDocuDataPath = Configuration.class
					.getClassLoader().getResource(
							EXAMPLE_DOCUMENTATION_DIRECTORY);
			File exampleDocuDataDirectoryPath = null;
			try {
				if (exampleDocuDataPath != null) {
					exampleDocuDataDirectoryPath = new File(
							exampleDocuDataPath.toURI());
				}
			} catch (final URISyntaxException e) {
				LOGGER.error(
						"Example documentation data is not accessible in resources.",
						e);
				return null;
			}
			if (exampleDocuDataDirectoryPath == null
					|| !exampleDocuDataDirectoryPath.exists()) {
				LOGGER.error("Example documentation data is missing in resources.");
				return null;
			}
			return exampleDocuDataDirectoryPath;
		} else {
			return new File(configuration.getTestDocumentationDirPath());
		}
	}
}
