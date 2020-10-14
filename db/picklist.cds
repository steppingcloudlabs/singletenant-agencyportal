namespace agencyportal.picklist;
using { managed, sap } from '@sap/cds/common';

entity picklist: managed{
	key ID: UUID @odata.Type:'Edm.String';
	picklistId: String not null;
	OptionId: String not null;
	externalcode: String not null;
	en_US: String not null;
};