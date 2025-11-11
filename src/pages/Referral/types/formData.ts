import type { Expertise } from "src/types/expertise";
import type { PartnerListing } from "src/types/partner";

export interface FormData {
    name? : string;
    partner?: PartnerListing;
    expertise?: Expertise;
}