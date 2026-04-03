import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import List "mo:core/List";
import Int "mo:core/Int";
import Float "mo:core/Float";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module Budget {
    public func compare(budget1 : Budget, budget2 : Budget) : Order.Order {
      switch (Text.compare(budget1.name, budget2.name)) {
        case (#equal) { Nat.compare(budget1.year, budget2.year) };
        case (order) { order };
      };
    };

    public func compareMeasure(budget1 : Budget, budget2 : Budget) : Order.Order {
      Float.compare((budget1.actual / budget1.plan), (budget2.actual / budget2.plan));
    };
  };

  module FinancialGoal {
    public func compare(goal1 : FinancialGoal, goal2 : FinancialGoal) : Order.Order {
      Text.compare(goal1.name, goal2.name);
    };

    public func compareByAmount(goal1 : FinancialGoal, goal2 : FinancialGoal) : Order.Order {
      Float.compare(goal1.amount, goal2.amount);
    };

    public func compareByProgress(goal1 : FinancialGoal, goal2 : FinancialGoal) : Order.Order {
      let progress1 = if (goal1.amount == 0.0) { 0.0 } else { goal1.current / goal1.amount };
      let progress2 = if (goal2.amount == 0.0) { 0.0 } else { goal2.current / goal2.amount };
      Float.compare(progress1, progress2);
    };
  };

  module Account {
    public func compare(account1 : Account, account2 : Account) : Order.Order {
      switch (Text.compare(account1.name, account2.name)) {
        case (#equal) { Int.compare(account1.balance, account2.balance) };
        case (order) { order };
      };
    };

    public func compareByBalance(account1 : Account, account2 : Account) : Order.Order {
      Int.compare(account1.balance, account2.balance);
    };
  };

  module Transaction {
    public func compare(trans1 : Transaction, trans2 : Transaction) : Order.Order {
      Int.compare(trans1.date, trans2.date);
    };

    public func compareByAmount(trans1 : Transaction, trans2 : Transaction) : Order.Order {
      Float.compare(trans1.amount, trans2.amount);
    };
  };

  // Persistent State
  type UserId = Principal;
  type HouseholdId = Nat;

  public type AccountType = {
    #bank_account;
    #credit_card;
    #investment;
    #loan;
  };

  public type TransactionType = {
    #expense;
    #income;
    #transfer;
  };

  public type Account = {
    name : Text;
    balance : Int;
    accountType : AccountType;
    category : Text;
    owner : UserId;
    currency : CurrencyCode;
    isShared : Bool;
  };

  public type Transaction = {
    id : ?Nat;
    account : Text;
    accountType : AccountType;
    household : ?HouseholdId;
    category : Text;
    amount : Float;
    currency : CurrencyCode;
    date : Time.Time;
    note : Text;
    transactionType : TransactionType;
    budget : ?Nat;
    isShared : Bool;
    isRecurring : Bool;
    split : Bool;
    recurringFrequency : ?RecurringTransactionFrequency;
  };

  public type Budget = {
    id : ?Nat;
    name : Text;
    category : Text;
    year : Nat;
    month : Nat;
    plan : Float;
    actual : Float;
    currency : CurrencyCode;
    isActive : Bool;
  };

  public type FinancialGoal = {
    name : Text;
    amount : Float;
    current : Float;
    targetDate : Time.Time;
    currency : CurrencyCode;
    isActive : Bool;
  };

  public type TransactionCategory = {
    id : Nat;
    name : Text;
  };

  public type TransactionCategory2 = Text;
  public type CurrencyCode = Text;

  public type RecurringTransactionFrequency = {
    #daily;
    #weekly;
    #biweekly;
    #monthly;
    #quarterly;
    #yearly;
  };

  public type DashboardSnapshot = {
    netWorth : Int;
    income : Float;
    expenses : Float;
    savings : Float;
    budgets : [Budget];
    goals : [FinancialGoal];
  };

  public type Currency = {
    code : Text;
    name : Text;
    symbol : Text;
    exchangeRate : Float;
  };

  public type RecurringTransaction = {
    id : Nat;
    name : Text;
    amount : Float;
    currency : CurrencyCode;
    frequency : RecurringTransactionFrequency;
    startDate : Time.Time;
    endDate : ?Time.Time;
    category : Text;
    note : Text;
    transactionType : TransactionType;
  };

  public type InvestmentType = {
    #stock;
    #bond;
    #mutualFund;
    #etf;
    #realEstate;
    #crypto;
  };

  public type InvestmentAsset = {
    id : Nat;
    name : Text;
    amount : Float;
    currency : CurrencyCode;
    assetType : InvestmentType;
    owner : UserId;
  };

  public type NetWorth = {
    assets : Float;
    liabilities : Float;
    netWorth : Float;
  };

  type HouseholdState = {
    id : Nat;
    name : Text;
    members : [UserId];
    owner : UserId;
  };

  public type FinancialGoalProgress = {
    goal : FinancialGoal;
    progress : Float;
    remainingAmount : Float;
    percentage : Float;
  };

  public type BudgetPlanDifference = {
    budget : Budget;
    difference : Float;
  };

  public type StandingOrder = {
    internalId : Text;
    from : Account;
    to : Account;
    amount : Float;
    currency : CurrencyCode;
    frequency : RecurringTransactionFrequency;
    nextPaymentDate : Time.Time;
    test : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  let accounts = Map.empty<UserId, List.List<Account>>();
  let transactions = Map.empty<UserId, List.List<Transaction>>();
  let budgets = Map.empty<UserId, List.List<Budget>>();
  let financialGoals = Map.empty<UserId, List.List<FinancialGoal>>();
  let standingOrders = Map.empty<UserId, Map.Map<Text, StandingOrder>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getBudgetsInternal(caller : Principal) : List.List<Budget> {
    switch (budgets.get(caller)) {
      case (null) { Runtime.trap("No budgets found. ") };
      case (?budgets) { budgets };
    };
  };

  func getFinancialGoalsInternal(caller : Principal) : List.List<FinancialGoal> {
    switch (financialGoals.get(caller)) {
      case (null) { Runtime.trap("No financial goals found. ") };
      case (?goals) { goals };
    };
  };

  func getAccountsInternal(caller : Principal) : List.List<Account> {
    switch (accounts.get(caller)) {
      case (null) { Runtime.trap("No accounts found. ") };
      case (?accounts) { accounts };
    };
  };

  func getTransactionsInternal(caller : Principal) : List.List<Transaction> {
    switch (transactions.get(caller)) {
      case (null) { Runtime.trap("No transactions found. ") };
      case (?transactions) { transactions };
    };
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Persistent logic
  public shared ({ caller }) func addBudget(budget : Budget) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save budgets");
    };

    let newBudget = budget;
    let userBudgets = List.empty<Budget>();
    userBudgets.add(newBudget);
    let existingBudgets = switch (budgets.get(caller)) {
      case (null) { List.empty<Budget>() };
      case (?existingBudgets) { existingBudgets };
    };

    for (budget in existingBudgets.values()) {
      userBudgets.add(budget);
    };
    budgets.add(caller, userBudgets);
  };

  public shared ({ caller }) func addFinancialGoal(goal : FinancialGoal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save financial goals");
    };

    let userGoals = List.empty<FinancialGoal>();
    let newGoal = goal;
    userGoals.add(newGoal);
    let existingGoals = switch (financialGoals.get(caller)) {
      case (null) { List.empty<FinancialGoal>() };
      case (?goals) { goals };
    };

    for (goal in existingGoals.values()) {
      userGoals.add(goal);
    };
    financialGoals.add(caller, userGoals);
  };

  public shared ({ caller }) func addAccount(account : Account) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save accounts");
    };
    let userAccounts = List.empty<Account>();
    userAccounts.add(account);

    let existingAccounts = switch (accounts.get(caller)) {
      case (null) { List.empty<Account>() };
      case (?accounts) { accounts };
    };

    for (account in existingAccounts.values()) {
      userAccounts.add(account);
    };
    accounts.add(caller, userAccounts);
  };

  public shared ({ caller }) func addTransaction(transaction : Transaction) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save transactions");
    };
    let userTransactions = List.empty<Transaction>();
    userTransactions.add(transaction);

    let existingTransactions = switch (transactions.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?transactions) { transactions };
    };

    for (transaction in existingTransactions.values()) {
      userTransactions.add(transaction);
    };
    transactions.add(caller, userTransactions);
  };

  // Queries
  public query ({ caller }) func getBudgets() : async [Budget] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access budgets");
    };
    getBudgetsInternal(caller).toArray().sort();
  };

  public query ({ caller }) func getBudgetsByPlan() : async [Budget] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access budgets");
    };
    getBudgetsInternal(caller).toArray().sort(Budget.compareMeasure);
  };

  public query ({ caller }) func getFinancialGoals() : async [FinancialGoal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access financial goals");
    };
    getFinancialGoalsInternal(caller).toArray().sort();
  };

  public query ({ caller }) func getFinancialGoalsByAmount() : async [FinancialGoal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access financial goals");
    };
    getFinancialGoalsInternal(caller).toArray().sort(FinancialGoal.compareByAmount);
  };

  public query ({ caller }) func getFinancialGoalsByProgress() : async [FinancialGoal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access financial goals");
    };
    getFinancialGoalsInternal(caller).toArray().sort(FinancialGoal.compareByProgress);
  };

  public query ({ caller }) func getAccounts() : async [Account] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access accounts");
    };
    getAccountsInternal(caller).toArray().sort();
  };

  public query ({ caller }) func getAccountsByBalance() : async [Account] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access accounts");
    };
    getAccountsInternal(caller).toArray().sort(Account.compareByBalance);
  };

  public query ({ caller }) func getBudgetsByYear(year : Nat) : async [Budget] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access budgets");
    };
    let userBudgets = getBudgetsInternal(caller);
    let filteredBudgets = userBudgets.filter(func(budget) { budget.year == year });
    filteredBudgets.toArray().sort();
  };

  public query ({ caller }) func getBudgetsByYearMonth(year : Nat, month : Nat) : async [Budget] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access budgets");
    };
    let userBudgets = getBudgetsInternal(caller);
    let filteredBudgets = userBudgets.filter(func(budget) { budget.year == year and budget.month == month });
    filteredBudgets.toArray().sort();
  };

  public query ({ caller }) func getBudgetsByCategory(category : Text) : async [Budget] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access budgets");
    };
    let userBudgets = getBudgetsInternal(caller);
    let filteredBudgets = userBudgets.filter(func(budget) { budget.category == category });
    filteredBudgets.toArray().sort();
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access transactions");
    };
    getTransactionsInternal(caller).toArray().sort();
  };

  public query ({ caller }) func getTransactionsByAmount() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access transactions");
    };
    getTransactionsInternal(caller).toArray().sort(Transaction.compareByAmount);
  };

  public query ({ caller }) func getTransactionsByAccount(account : Text) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access transactions");
    };
    let userTransactions = getTransactionsInternal(caller);
    let filteredTransactions = userTransactions.filter(func(transaction) { transaction.account == account });
    filteredTransactions.toArray().sort();
  };

  public query ({ caller }) func getTransactionsByCategory(category : Text) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access transactions");
    };
    let userTransactions = getTransactionsInternal(caller);
    let filteredTransactions = userTransactions.filter(func(transaction) { transaction.category == category });
    filteredTransactions.toArray().sort();
  };

  public query ({ caller }) func getTransactionsByBudget(budget : Nat) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access transactions");
    };
    let userTransactions = getTransactionsInternal(caller);
    let filteredTransactions = userTransactions.filter(
      func(transaction) {
        switch (transaction.budget) {
          case (null) { false };
          case (?id) { id == budget };
        };
      }
    );
    filteredTransactions.toArray().sort();
  };

  public shared ({ caller }) func addStandingOrder(standingOrder : StandingOrder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save standing orders");
    };
    let userOrders = switch (standingOrders.get(caller)) {
      case (null) { Map.empty<Text, StandingOrder>() };
      case (?orders) { orders };
    };
    userOrders.add(standingOrder.internalId, standingOrder);
    standingOrders.add(caller, userOrders);
  };

  public query ({ caller }) func getStandingOrder(standingOrderId : Text) : async StandingOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access standing orders");
    };
    let userOrders = switch (standingOrders.get(caller)) {
      case (null) { Runtime.trap("No standing orders found. ") };
      case (?orders) { orders };
    };
    switch (userOrders.get(standingOrderId)) {
      case (null) { Runtime.trap("Standing order not found. ") };
      case (?standingOrder) { standingOrder };
    };
  };

  public query ({ caller }) func getAllStandingOrders() : async [StandingOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access standing orders");
    };
    let userOrders = switch (standingOrders.get(caller)) {
      case (null) { return [] };
      case (?orders) { orders };
    };
    let valuesIter = userOrders.values();
    valuesIter.toArray();
  };
};
