import type { AnalyticsPayload } from "./analytics";
import type { UserTarget } from "./target";
import type { MockScoreSummary } from "./mock-score";

/**
 * Combined response from the /api/dashboard endpoint.
 * Bundles analytics, user target, and mock score summary
 * into a single payload to avoid multiple proxy round trips.
 */
export interface DashboardBundle {
  analytics: AnalyticsPayload;
  userTarget: UserTarget;
  mockSummary: MockScoreSummary;
}
