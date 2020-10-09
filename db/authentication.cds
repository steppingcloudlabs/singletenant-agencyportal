namespace agencyportal.authentication;
using { managed, sap } from '@sap/cds/common';

entity user: managed{
	key ID: UUID @odata.Type:'Edm.String';
	userid: String not null;
	username: String not null;
	password: String not null;
	agencyid: String not null;
	agencyname: String not null;
	companyname: String not null;
};