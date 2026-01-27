import type { ExpertiseListing } from "src/types/expertise";

export interface GroupedExpertise extends ExpertiseListing {
  children: ExpertiseListing[];
}
