package org.scenarioo.rest.application;

public enum ContextPathHolder {
	INSTANCE;

	private String contextPath;

	public void setContextPath(String contextPath) {
		this.contextPath = contextPath;
	}

	public String getContextPath() {
		return contextPath;
	}
}
