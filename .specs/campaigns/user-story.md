# Campaigns Feature - User Story Document

## Feature Summary

The Campaigns feature enables store administrators to create and manage targeted promotional campaigns that assign discounts to specific customer segments across chosen product categories. Campaigns support two modes: simple Discount campaigns and A/B Test campaigns that split customers between two different offers to measure which performs better.

This feature introduces a complete campaign lifecycle (Draft, Scheduled, Active, Paused, Ended) with a dashboard for monitoring performance KPIs such as revenue, orders, conversion rate, and per-variant analytics.

**Target Users:** Store administrators and merchants using the Shopizer admin panel.

**Business Value:** Enables data-driven promotional decisions by allowing merchants to segment customers, target them with specific offers, and compare offer effectiveness through A/B testing -- ultimately improving conversion rates and revenue.

---

## 1. User Stories

### US-1: View Campaign List with Summary Statistics

**As a** store administrator,
**I want to** see all campaigns in a card-based list with summary statistics,
**so that** I can quickly assess the state of my promotional efforts at a glance.

#### Acceptance Criteria

- [ ] WHEN the admin navigates to `/pages/campaigns/list` THEN the system SHALL display all campaigns as individual cards sorted by most recently created.
- [ ] WHEN the campaign list loads THEN the system SHALL display a summary stats row showing: Total Campaigns count, Active campaigns count, A/B Tests count, and Total Customers Targeted (sum of all campaign customer counts).
- [ ] WHEN campaigns exist THEN each campaign card SHALL display: campaign name, status badge (ACTIVE/DRAFT/PAUSED/SCHEDULED/ENDED), type badge (Discount or A/B Test), description text, customer segment name, customer count, discount percentage or fixed amount, target categories, date period (start -> end), and conversion rate (if available).
- [ ] WHEN a campaign has no conversion data yet (e.g., DRAFT or SCHEDULED status) THEN the conversion rate field SHALL be hidden on that card.
- [ ] WHEN the admin clicks anywhere on a campaign card (outside action buttons) THEN the system SHALL navigate to the campaign detail/view page (`/pages/campaigns/view/:id`).
- [ ] WHEN the campaign list is loading THEN the system SHALL display a spinner overlay on the card body.
- [ ] WHEN no campaigns exist THEN the system SHALL display an empty state message indicating no campaigns have been created yet.

#### Status Badge Color Mapping

| Status    | CSS Class        | Appearance                  |
|-----------|------------------|-----------------------------|
| ACTIVE    | `badge-success`  | Green background, green text |
| DRAFT     | `badge-secondary`| Gray background, gray text   |
| PAUSED    | `badge-warning`  | Yellow background, amber text|
| SCHEDULED | `badge-info`     | Blue background, blue text   |
| ENDED     | `badge-dark`     | Dark gray background         |

---

### US-2: Create a New Campaign

**As a** store administrator,
**I want to** create a new campaign by specifying its name, type, schedule, customer segment, discount configuration, and optionally an A/B test variant,
**so that** I can launch targeted promotions for specific customer groups.

#### Acceptance Criteria

- [ ] WHEN the admin clicks "Create Campaign" (from the toolbar or sidebar menu) THEN the system SHALL navigate to `/pages/campaigns/create` and display a blank campaign creation form.
- [ ] WHEN creating a campaign THEN the form SHALL require the following fields: Campaign Name, Campaign Type, Start Date, End Date, Customer Group, Discount Value, and at least one target Category. Description and Status are optional (Status defaults to DRAFT).
- [ ] WHEN the admin fills in Basic Information THEN the form SHALL provide: a text input for Campaign Name, a textarea for Description, a dropdown for Campaign Type (Discount Campaign, A/B Test), a dropdown for Status (Draft, Scheduled, Active, Paused), and date pickers for Start Date and End Date.
- [ ] WHEN the admin selects a Customer Group from the dropdown THEN the system SHALL display the customer count for that group inline (e.g., "VIP Customers (8 customers)").
- [ ] WHEN the admin configures the discount THEN the form SHALL provide: a Discount Type dropdown (Percentage / Fixed Amount), a numeric Discount Value input, and a chip-style multi-select for target categories.
- [ ] WHEN the admin clicks a category chip THEN the chip SHALL toggle between selected (filled blue with checkmark) and unselected (outlined gray) states.
- [ ] WHEN the admin selects Campaign Type = "A/B Test" THEN the form SHALL reveal an additional "A/B Test Configuration" section with a Variant B Offer dropdown (Free Shipping, Double Loyalty Points, Free Gift Item, Lower Discount) and a visual split preview showing "Variant A (50%) - [discount details] vs Variant B (50%) - [selected offer]".
- [ ] WHEN the admin selects Campaign Type = "Discount" THEN the A/B Test Configuration section SHALL be hidden.
- [ ] WHEN the admin clicks "Create Campaign" THEN the system SHALL validate all required fields and, if valid, persist the campaign and redirect to the campaign list.
- [ ] WHEN the admin clicks "Save as Draft" THEN the system SHALL set the campaign status to DRAFT before saving, regardless of the Status dropdown value.
- [ ] WHEN the admin clicks "Cancel" THEN the system SHALL discard changes and navigate back to the campaign list.
- [ ] WHEN validation fails (missing required fields) THEN the system SHALL highlight the invalid fields and display appropriate error messages without navigating away.
- [ ] WHEN the admin sets an End Date earlier than the Start Date THEN the system SHALL display a validation error.

#### Available Customer Groups (from prototype)

| Group Name          | Description                          |
|---------------------|--------------------------------------|
| VIP Customers       | High-value repeat customers          |
| New Registrations   | Recently registered customers        |
| Inactive 90+ Days   | Customers with no activity for 90+ days |
| Wholesale           | Wholesale/bulk buyer accounts        |
| All Customers       | Entire customer base                 |

#### A/B Test Variant B Options

| Value            | Display Label         |
|------------------|-----------------------|
| FREE_SHIPPING    | Free Shipping         |
| DOUBLE_POINTS    | Double Loyalty Points |
| GIFT_ITEM        | Free Gift Item        |
| LOWER_DISCOUNT   | Lower Discount (half) |

---

### US-3: Edit an Existing Campaign

**As a** store administrator,
**I want to** edit an existing campaign's details,
**so that** I can adjust promotions based on business needs without recreating them from scratch.

#### Acceptance Criteria

- [ ] WHEN the admin clicks the Edit button on a campaign card or the "Edit Campaign" button on the view page THEN the system SHALL navigate to `/pages/campaigns/edit/:id` and populate the form with the existing campaign data.
- [ ] WHEN editing a campaign THEN the page title SHALL display "Edit Campaign" instead of "Create Campaign".
- [ ] WHEN the admin modifies fields and clicks "Update Campaign" THEN the system SHALL validate, persist the changes, and redirect to the campaign list.
- [ ] WHEN editing an ACTIVE campaign THEN the system SHALL warn the admin that changes may affect currently enrolled customers.
- [ ] WHEN the admin changes the Customer Group on an active campaign THEN the system SHALL re-evaluate which customers are enrolled and update assignments accordingly.
- [ ] IF an A/B Test campaign already has performance data THEN the system SHALL prevent changing the Campaign Type from A/B Test to Discount (to preserve data integrity).

---

### US-4: Duplicate a Campaign

**As a** store administrator,
**I want to** duplicate an existing campaign,
**so that** I can quickly create a similar campaign without re-entering all the configuration manually.

#### Acceptance Criteria

- [ ] WHEN the admin clicks the Duplicate button on a campaign card THEN the system SHALL create a copy of the campaign with the name prefixed by "Copy of " and status set to DRAFT.
- [ ] WHEN a campaign is duplicated THEN the new campaign SHALL copy all fields (type, description, customer group, categories, discount configuration, A/B test config) except: status (set to DRAFT), start/end dates (cleared for the admin to set), and any performance data (reset to zero).
- [ ] WHEN duplication succeeds THEN the system SHALL navigate to the edit page for the newly created campaign.
- [ ] WHEN duplication fails THEN the system SHALL display an error toast notification.

---

### US-5: Delete a Campaign

**As a** store administrator,
**I want to** delete a campaign that is no longer needed,
**so that** I can keep my campaign list clean and relevant.

#### Acceptance Criteria

- [ ] WHEN the admin clicks the Delete button on a campaign card THEN the system SHALL display a confirmation dialog: "Are you sure you want to delete [campaign name]? This action cannot be undone."
- [ ] WHEN the admin confirms deletion THEN the system SHALL remove the campaign, un-assign all associated customers, and refresh the campaign list.
- [ ] WHEN the admin cancels the confirmation dialog THEN the system SHALL take no action.
- [ ] IF the campaign is currently ACTIVE THEN the confirmation dialog SHALL include an additional warning: "This campaign is currently active. Deleting it will immediately remove all active discounts for enrolled customers."
- [ ] WHEN deletion succeeds THEN the system SHALL display a success toast notification.
- [ ] WHEN deletion fails THEN the system SHALL display an error toast notification and retain the campaign in the list.

---

### US-6: View Campaign Details and Performance KPIs

**As a** store administrator,
**I want to** view a detailed page for a specific campaign showing performance metrics, configuration, and enrolled customers,
**so that** I can evaluate the campaign's effectiveness and make informed decisions.

#### Acceptance Criteria

- [ ] WHEN the admin navigates to `/pages/campaigns/view/:id` THEN the system SHALL display the campaign detail page with a back navigation link ("Back to Campaigns"), the campaign name as the page title, status badge, and type badge.
- [ ] WHEN the campaign detail loads THEN the system SHALL display five KPI cards: Total Revenue ($), Orders (count), Conversion Rate (%), Customers (count), and Discount (% or $ value).
- [ ] WHEN the campaign detail loads THEN the system SHALL display a Campaign Details section showing: Period (start -> end dates), Customer Segment name, Target Categories (as individual styled tags), and Discount value.
- [ ] WHEN the campaign is an A/B Test THEN the system SHALL display an "A/B Test Variants" section showing Variant A and Variant B side-by-side, each with: variant label/description, customer count, conversions count, revenue, and a visual progress bar representing relative performance.
- [ ] WHEN the campaign detail loads THEN the system SHALL display an "Assigned Customers" table with columns: ID, Name, Email, Variant (A/B badge), Orders, Amount Spent, and a Remove action button.
- [ ] WHEN the admin clicks "Edit Campaign" in the header actions THEN the system SHALL navigate to the campaign edit page.
- [ ] WHEN the admin clicks "Pause" in the header actions THEN the system SHALL change the campaign status to PAUSED and update the UI accordingly.
- [ ] WHEN the admin clicks "Back to Campaigns" THEN the system SHALL navigate to the campaign list.

#### KPI Display Format

| KPI             | Format          | Example       |
|-----------------|-----------------|---------------|
| Total Revenue   | Currency ($)    | $14,250       |
| Orders          | Integer count   | 23            |
| Conversion Rate | Percentage      | 12.5%         |
| Customers       | Integer count   | 8             |
| Discount        | Percentage or $ | 20%           |

---

### US-7: Remove a Customer from a Campaign

**As a** store administrator,
**I want to** remove individual customers from a campaign's assigned customer list,
**so that** I can manually exclude specific customers who should not receive the campaign's offers.

#### Acceptance Criteria

- [ ] WHEN the admin clicks the "Remove" button on a customer row in the Assigned Customers table THEN the system SHALL display a confirmation prompt: "Remove [customer name] from this campaign?"
- [ ] WHEN the admin confirms removal THEN the system SHALL un-assign the customer from the campaign, remove the row from the table, and update the Customers KPI count.
- [ ] WHEN the admin cancels the removal prompt THEN the system SHALL take no action.
- [ ] WHEN a customer is removed from a campaign THEN the customer's campaign badge in the customer list page SHALL also be cleared.
- [ ] IF the campaign is an A/B Test THEN removing a customer SHALL update the corresponding variant's customer count and recalculate the conversion rate.

---

### US-8: View Campaign Assignment on Customer List

**As a** store administrator,
**I want to** see which campaign each customer is assigned to directly on the customer list page,
**so that** I can quickly identify customer-campaign relationships without navigating to each campaign.

#### Acceptance Criteria

- [ ] WHEN the customer list page loads THEN the system SHALL display a "Campaign" column in the customer table.
- [ ] WHEN a customer is assigned to a campaign THEN the Campaign column SHALL display the campaign name as a color-coded badge.
- [ ] WHEN a customer is not assigned to any campaign THEN the Campaign column SHALL display a gray dash character.
- [ ] WHEN displaying campaign badges THEN each campaign SHALL have a distinct, consistent color across the application.

#### Campaign Color Mapping (from prototype)

| Campaign Name             | Badge Color |
|---------------------------|-------------|
| Summer Sale 2026          | Green (#00d68f) |
| New Customer Welcome      | Blue (#3366ff) |
| Win-back Inactive Users   | Yellow (#ffaa00) |
| Wholesale Tier Pricing    | Red (#ff3d71) |
| Holiday Pre-Sale          | Purple (#8f5ee8) |

---

### US-9: Pause and Resume a Campaign

**As a** store administrator,
**I want to** pause an active campaign and resume it later,
**so that** I can temporarily halt a promotion without losing its configuration or data.

#### Acceptance Criteria

- [ ] WHEN the admin clicks "Pause" on an ACTIVE campaign's detail page THEN the system SHALL change the campaign status to PAUSED and the discounts SHALL stop being applied to enrolled customers.
- [ ] WHEN the campaign is PAUSED THEN the detail page SHALL display a "Resume" button in place of the "Pause" button.
- [ ] WHEN the admin clicks "Resume" on a PAUSED campaign THEN the system SHALL change the status back to ACTIVE and re-apply discounts.
- [ ] WHEN a campaign is paused or resumed THEN the status badge SHALL update immediately across the detail page and the list page.
- [ ] WHEN a campaign is paused THEN its performance data (revenue, orders, conversions) SHALL be preserved and not reset.

---

### US-10: Campaign Status Lifecycle Automation

**As a** store administrator,
**I want** campaigns to automatically transition between SCHEDULED and ACTIVE and ENDED states based on their date range,
**so that** I do not have to manually start and stop campaigns.

#### Acceptance Criteria

- [ ] WHEN a campaign has status SCHEDULED and the current date reaches the Start Date THEN the system SHALL automatically transition the campaign to ACTIVE status.
- [ ] WHEN a campaign has status ACTIVE and the current date exceeds the End Date THEN the system SHALL automatically transition the campaign to ENDED status.
- [ ] WHEN a campaign transitions to ENDED THEN the discounts SHALL stop being applied to enrolled customers.
- [ ] WHEN a campaign is PAUSED and its End Date passes THEN the system SHALL transition it to ENDED (paused campaigns should still respect their end date).
- [ ] WHEN status transitions occur automatically THEN the system SHALL log the transition event for audit purposes.

---

### US-11: Filter and Search Campaigns

**As a** store administrator,
**I want to** filter campaigns by status and type,
**so that** I can quickly find specific campaigns in a large list.

#### Acceptance Criteria

- [ ] WHEN the admin is on the campaign list page THEN the system SHALL provide filter options for Status (All, Active, Draft, Paused, Scheduled, Ended) and Type (All, Discount, A/B Test).
- [ ] WHEN a filter is applied THEN the campaign cards and summary stats SHALL update to reflect only the filtered results.
- [ ] WHEN the admin clears all filters THEN the full campaign list and aggregate stats SHALL be restored.

**Note:** The prototype includes a `CampaignFilterPipe` that filters by status or type. The production implementation should support combined filters and potentially a text search on campaign name.