import type { AssignedExpertise } from "src/types/expertise";
import type { PartnerListing } from "src/types/partner";

export interface FormData {
    name? : string;
    partner?: PartnerListing;
    expertise?: AssignedExpertise;
}