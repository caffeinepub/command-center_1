# Command Center — Financial Management Platform

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Full financial command center dashboard with sidebar navigation
- Net Worth tracking (total assets, liabilities, net calculation)
- Transaction list with categories, merchant icons, amounts, and color-coded positive/negative values
- Spending Breakdown with donut chart visualization (by category)
- Budget tracking with plan vs. actual progress bars per category
- Bill Calendar showing upcoming recurring bills
- Investment holdings overview with performance tracking
- Goals system (link accounts/transactions to financial targets)
- Household multi-user collaboration (shared data, "Needs Review" flags, comments on transactions)
- Demo Mode toggle for privacy (blur sensitive numbers)
- Dark/light mode toggle
- Account management: Bank, Credit Card, Investment, Loan, Crypto, Real Estate, Manual Assets
- Transaction rules engine (category auto-assignment, merchant renaming)
- Transaction splitting support (divide one transaction into multiple categories)
- CSV Migration Wizard (import from Mint, Empower, YNAB)
- Subscription/bill recurrence detection
- Sankey diagram for cash flow visualization
- Net Worth historical chart
- Asset Allocation pie chart
- Drag-and-drop widget dashboard
- Settings: profile, security (MFA), subscription plan, household members

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- User profile and household data model
- Accounts CRUD (bank, credit, investment, loan, crypto, real estate, manual)
- Transactions CRUD with categories, flags, comments, split support
- Budgets CRUD (category-based, flex-based, rollovers)
- Goals CRUD (linked accounts/transactions)
- Net Worth calculation (assets minus liabilities)
- Recurring bills detection + bill calendar data
- Household member management (invite, roles)
- Demo mode flag per user
- Sample/seed data for demo purposes

### Frontend
- App shell: dark sidebar + main content area
- Sidebar: branding, user profile, nav items (Dashboard, Transactions, Budgets, Investments, Goals, Reports, Settings)
- Dashboard page: greeting, net worth card, spending donut chart, categories list, recent transactions, budget progress, bill calendar
- Transactions page: filterable/searchable transaction table with flags and comments
- Budgets page: plan vs. actual view, category and flex budget toggle
- Investments page: holdings table, asset allocation pie, benchmark comparisons
- Goals page: goal cards with progress and linked accounts
- Reports page: Sankey diagram, net worth historical chart
- Settings page: profile, household members, subscription, dark/light mode, demo mode
- CSV Migration Wizard modal
- All charts via Recharts (donut, bar, line, sankey)
- Dark/light mode via Tailwind class strategy
- Demo mode blurs/masks sensitive values
