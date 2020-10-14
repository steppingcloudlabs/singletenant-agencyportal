namespace agencyportal.jobs;
using { managed, sap } from '@sap/cds/common';

entity jobs: managed{
	key ID: UUID @odata.Type:'Edm.String';
	JobReqID: String not null;
	JobPostingStartDate: String not null;
	JobPostingEndDate: String not null;
	county: String;
};