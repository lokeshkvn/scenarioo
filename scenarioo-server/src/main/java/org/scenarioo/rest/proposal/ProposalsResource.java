package org.scenarioo.rest.proposal;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.scenarioo.business.builds.ScenarioDocuBuildsManager;
import org.scenarioo.dao.design.aggregates.IssueAggregationDAO;
import org.scenarioo.model.design.aggregates.ProposalSteps;
import org.scenarioo.repository.ConfigurationRepository;
import org.scenarioo.repository.RepositoryLocator;
import org.scenarioo.rest.base.BuildIdentifier;
import org.scenarioo.rest.base.design.ProposalIdentifier;
import org.scenarioo.rest.scenario.mapper.ScenarioDetailsMapper;
import org.scenarioo.utils.design.readers.DesignReader;

@Path("/rest/branch/{branchName}/issues/{issueName}/proposals/{proposalName}")
public class ProposalsResource {


	private final ConfigurationRepository configurationRepository = RepositoryLocator.INSTANCE
			.getConfigurationRepository();

	private final IssueAggregationDAO dao = new IssueAggregationDAO(
			configurationRepository.getDocumentationDataDirectory());

	private final DesignReader reader = new DesignReader(configurationRepository.getDesignDataDirectory());

	private final ScenarioDetailsMapper scenarioDetailsMapper = new ScenarioDetailsMapper();

	@GET
	@Produces({ "application/xml", "application/json" })
	public ProposalSteps loadProposal(@PathParam("branchName") final String branchName,
			@PathParam("issueName") final String issueName,
			@PathParam("proposalName") final String proposalName) {

		BuildIdentifier buildIdentifier = ScenarioDocuBuildsManager.INSTANCE.resolveBranchAndBuildAliases(branchName,
				"");
		ProposalIdentifier proposalIdentifier = new ProposalIdentifier(buildIdentifier, issueName, proposalName);

		ProposalSteps proposalSteps = dao.loadProposalSteps(proposalIdentifier);

		// TODO: Investigate whether ProposalDetails and ProposalMapper are necessary
		return proposalSteps;
	}

}