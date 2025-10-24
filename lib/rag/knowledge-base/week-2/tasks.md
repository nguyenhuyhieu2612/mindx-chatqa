# Week 2 Tasks: Metrics Setup and Problem Discovery

**Authors:** HuyNQ, Claude  
**Document Summary:** This document provides a comprehensive step-by-step guide for completing Week 2 objectives of the MindX Engineer Onboarding program. Building upon the Week 1 full-stack application deployed on Azure Kubernetes Service, this guide covers implementing production monitoring with Azure Application Insights (focusing on the Golden Signals: Latency, Error Rate, Traffic, and Capacity), product analytics with Google Analytics, and problem discovery with rapid prototyping. The final deliverable includes a fully monitored production application with comprehensive observability, user behavior tracking, and validated problem-solution proposals.

**Customization Note:** This guide can be adapted to your monitoring preferences, analytics requirements, or problem domains while ensuring the Week 2 objectives are met. Feel free to adjust monitoring thresholds, add custom metrics, or focus on specific organizational problems.

## 🔧 Sys Admin / DevOps Collaboration Guide

**Permission Levels:**

- **Developer:** Can instrument code, view metrics, create basic alerts
- **DevOps:** Can create App Insights resources, configure alerts, manage monitoring infrastructure
- **Sys Admin:** Can set up notification channels, approve monitoring agents, manage capacity planning

**Quick Self-Assessment:**

- Run `az monitor app-insights component show --app <name> --resource-group <rg>` - Can you see App Insights details?
- Check if you can access Azure Portal monitoring dashboards
- Verify you have permissions to create Action Groups for alerts

---

## Part A: Production Metrics with Azure Application Insights

### Overview

Implement comprehensive production monitoring for the Week 1 application using Azure Application Insights, covering the four Golden Signals (Latency, Error Rate, Traffic, Capacity) plus comprehensive logging and critical alerting.

### Prerequisites

- Completed Week 1 with full-stack application running on AKS
- Azure subscription with monitoring permissions
- Access to Azure Portal for dashboard creation
- Email or Azure mobile app for alert notifications

### Step 1: Create and Configure Azure Application Insights

#### 1.1 Create Application Insights Resource

Set up a new Application Insights instance in the same region as your AKS cluster for optimal performance and cost efficiency.

**🔧 DevOps Collaboration:** Creating App Insights requires Azure permissions

- **Check:** Can you run `az monitor app-insights component create --app myapp-insights --resource-group mygroup --location eastus`?
- **If No:** Request DevOps team to create App Insights resource and provide instrumentation key

#### 1.2 Retrieve Instrumentation Key

Get the instrumentation key (connection string) that will be used to connect your applications to Application Insights.

#### 1.3 Configure Workspace-based App Insights

Link Application Insights to a Log Analytics workspace for advanced querying and long-term retention of monitoring data.

### 🤖 AI Learning Hints

**Where to start:**
_"I need to understand Azure Application Insights and the Four Golden Signals (Latency, Error Rate, Traffic, Capacity). What are the fundamental concepts of observability and production monitoring I should learn first?"_

**What key points to learn:**
_"I'm setting up comprehensive monitoring with App Insights for my AKS application. What are the essential concepts about telemetry, metrics aggregation, distributed tracing, and the Golden Signals monitoring pattern?"_

**How to create plan to execute:**
_"Help me create a step-by-step plan to implement Application Insights with focus on Latency, Error Rate, Traffic, and Capacity monitoring. Include both automatic and custom instrumentation approaches."_

**How to troubleshoot using AI:**
_"My Application Insights isn't receiving telemetry data. Here's my configuration and the output from `kubectl logs [pod-name]` showing the App Insights SDK initialization: [paste logs]. What could be preventing telemetry collection?"_

---

### Step 2: Backend API Instrumentation

#### 2.1 Install Application Insights SDK

Add the Application Insights Node.js SDK to your API project with all necessary dependencies for comprehensive telemetry collection.

#### 2.2 Configure Automatic Telemetry Collection

Set up the SDK to automatically collect:

- **Latency:** Response time for all API endpoints
- **Traffic:** Request rate and throughput metrics
- **Dependencies:** External service calls (database, APIs)
- **Exceptions:** Unhandled errors and stack traces

#### 2.3 Implement Custom Logging

Add structured logging throughout your API for better debugging:

- **Default Logging:** Use App Insights default console integration
- **Custom Events:** Track business-specific events (user actions, feature usage)
- **Custom Metrics:** Record application-specific measurements
- **Correlation IDs:** Enable distributed tracing across services

#### 2.4 Add Performance Counters

Configure collection of system metrics for capacity monitoring:

- **CPU Usage:** Processor utilization percentage
- **Memory (RAM):** Available memory and working set
- **Disk I/O:** Read/write operations and latency
- **Network:** Bandwidth utilization and connection counts

#### 2.5 Update Kubernetes Deployment

Modify your API deployment manifest to include:

- Application Insights connection string as environment variable
- Resource requests and limits for accurate capacity monitoring
- Liveness and readiness probes for availability tracking

### 🤖 AI Learning Hints

**Where to start:**
_"I need to instrument my Node.js API with Application Insights for production monitoring. What are the key concepts of telemetry, custom events, and performance counters I should understand?"_

**What key points to learn:**
_"I'm implementing the Four Golden Signals monitoring in my Node.js API. How do I properly instrument for Latency tracking, Error Rate monitoring, Traffic measurement, and Capacity usage collection?"_

**How to create plan to execute:**
_"Guide me through adding comprehensive Application Insights instrumentation to my Node.js Express API, including automatic telemetry, custom logging, and performance counters for full observability."_

**How to troubleshoot using AI:**
_"My custom metrics aren't appearing in Application Insights. Here's my instrumentation code and the telemetry client configuration: [paste code]. Help me debug why custom events and metrics aren't being sent."_

---

### Step 3: Frontend React App Instrumentation (Optional but Recommended)

#### 3.1 Install Application Insights JavaScript SDK

Add the Application Insights browser SDK to your React application for client-side monitoring.

#### 3.2 Configure Browser Telemetry

Set up automatic collection of:

- **Page Views:** Navigation and route changes
- **Browser Exceptions:** JavaScript errors with stack traces
- **AJAX Calls:** API request performance from client perspective
- **User Sessions:** Active users and session duration

#### 3.3 Add Custom Browser Events

Implement tracking for:

- User interactions (clicks, form submissions)
- Feature usage patterns
- Client-side performance metrics
- Error boundaries in React components

#### 3.4 Update React App Deployment

Configure the React app with Application Insights connection string through environment variables or build-time configuration.

### 🤖 AI Learning Hints

**Where to start:**
_"I need to add Application Insights to my React application for client-side monitoring. What are the fundamental concepts of browser telemetry, user session tracking, and client-side error monitoring?"_

**What key points to learn:**
_"I'm implementing browser monitoring with Application Insights in React. How do I track page views in a SPA, capture JavaScript errors, measure AJAX performance, and create custom events for user interactions?"_

**How to create plan to execute:**
_"Help me integrate Application Insights JavaScript SDK into my React app with proper initialization, route change tracking, error boundary integration, and custom event tracking."_

**How to troubleshoot using AI:**
_"Application Insights isn't tracking my React route changes. Here's my App Insights initialization code and React Router setup: [paste code]. What's preventing proper SPA page view tracking?"_

---

### Step 4: Configure Monitoring Dashboards

#### 4.1 Create Application Dashboard

Build a comprehensive monitoring dashboard displaying:

- **Latency Metrics:** P50, P95, P99 response times
- **Error Rate:** Failed requests percentage and error trends
- **Traffic Volume:** Requests per second, daily active users
- **Capacity Metrics:** CPU, memory, disk usage graphs

#### 4.2 Set Up Application Map

Configure the application map to visualize:

- Service dependencies and communication patterns
- Cross-service latency and failure rates
- External dependency health

#### 4.3 Create Custom Kusto Queries

Write KQL (Kusto Query Language) queries for:

- Top slowest endpoints
- Most frequent errors
- Traffic patterns by time of day
- Capacity usage trends

#### 4.4 Build Live Metrics Stream

Set up real-time monitoring for:

- Incoming request rate
- Current failure rate
- Live dependency tracking
- Real-time server metrics

### 🤖 AI Learning Hints

**Where to start:**
_"I need to create monitoring dashboards in Azure Application Insights. What are the key concepts of KQL queries, dashboard widgets, and the Four Golden Signals visualization?"_

**What key points to learn:**
_"I'm building dashboards for Latency, Error Rate, Traffic, and Capacity monitoring. What KQL queries, chart types, and dashboard layouts best represent these Golden Signals?"_

**How to create plan to execute:**
_"Guide me through creating a comprehensive Application Insights dashboard with queries for P95 latency, error rate trends, traffic patterns, and capacity utilization metrics."_

**How to troubleshoot using AI:**
_"My KQL query for calculating P95 latency isn't working correctly. Here's my query: [paste KQL]. Help me fix the query to properly calculate percentile response times."_

---

### Step 5: Implement Critical Alerting

#### 5.1 Define Alert Rules for Critical Issues

Create alert rules for scenarios that require immediate attention:

**System Down Alerts:**

- Availability drops below 99% (service unavailable)
- All health check probes failing
- Zero successful requests for 5+ minutes

**Performance Degradation Alerts:**

- P95 latency exceeds 5 seconds (too slow to use)
- P99 latency exceeds 10 seconds
- Response time increased by 300% from baseline

**Error Rate Alerts:**

- Error rate exceeds 5% of traffic (too many errors)
- 500-series errors exceed 1% of requests
- Specific critical endpoints failing

**Capacity Alerts:**

- CPU usage above 80% for 10+ minutes
- Memory usage above 85% sustained
- Disk space below 10% available
- Pod restart rate exceeds normal threshold

#### 5.2 Configure Action Groups

Set up notification channels for alerts:

- **Email Notifications:** Send to on-call engineers
- **Azure Mobile App:** Push notifications for critical issues
- **SMS (Optional):** For highest severity incidents
- **Webhook Integration:** Connect to incident management tools

#### 5.3 Test Alert Configuration

Verify alerts work correctly by:

- Simulating high load to trigger latency alerts
- Introducing controlled errors to test error rate alerts
- Reducing resource limits to test capacity alerts
- Confirming notifications arrive through configured channels

#### 5.4 Create Runbook Documentation

Document response procedures for each alert type including:

- Alert severity and expected response time
- Initial investigation steps
- Escalation procedures
- Common remediation actions

### 🤖 AI Learning Hints

**Where to start:**
_"I need to set up critical production alerts in Application Insights. What are the best practices for defining alert thresholds, avoiding alert fatigue, and ensuring alerts are actionable?"_

**What key points to learn:**
_"I'm implementing alerts for system down, performance degradation, high error rates, and capacity issues. What are appropriate thresholds, time windows, and severity levels for production alerting?"_

**How to create plan to execute:**
_"Help me design a comprehensive alerting strategy with specific rules for availability, latency (P95/P99), error rates, and capacity (CPU/memory/disk) including proper thresholds and action groups."_

**How to troubleshoot using AI:**
_"My Application Insights alerts aren't triggering despite meeting conditions. Here's my alert rule configuration and recent metrics: [paste details]. Help me debug why alerts aren't firing."_

---

### Step 6: Validate Production Metrics Setup

#### 6.1 Generate Test Load

Use tools like Apache Bench or k6 to generate traffic and validate:

- Latency metrics are accurately recorded
- Traffic volume is correctly measured
- Error scenarios are properly tracked
- Capacity metrics reflect actual usage

#### 6.2 Verify All Golden Signals

Confirm each signal is properly monitored:

- **Latency:** Check P50, P95, P99 percentiles in dashboard
- **Error Rate:** Verify error percentage calculation
- **Traffic:** Validate request counts and throughput
- **Capacity:** Ensure CPU, memory, disk metrics are accurate

#### 6.3 Test Alert Notifications

Trigger each alert type and verify:

- Notifications arrive within expected timeframe
- Alert details provide sufficient context
- Action groups work for all channels
- Alert resolution is properly detected

#### 6.4 Document Monitoring Setup

Create documentation covering:

- Dashboard URLs and access instructions
- Alert rules and thresholds
- Instrumentation key management
- Troubleshooting guide for common issues

### Deliverables for Part A

- Application Insights fully integrated with backend API
- Optional frontend monitoring configured
- Comprehensive dashboard showing all Golden Signals
- Critical alerts configured with proper notifications
- Custom logging and metrics implemented
- Complete documentation of monitoring setup

### Success Criteria

- All Four Golden Signals visible in dashboards
- Custom and default logging working correctly
- Critical alerts tested and notifications confirmed
- Performance baseline established
- Monitoring data retained per configured policy
- Team can interpret and act on monitoring data

---

## Part B: Product Metrics with Google Analytics

### Overview

Implement product analytics to understand user behavior, feature adoption, and business metrics using Google Analytics 4 (GA4) in the React frontend application.

### Prerequisites

- Completed Part A with production monitoring in place
- Google account for Analytics setup
- React frontend deployed and accessible
- Basic understanding of web analytics concepts

### Step 1: Google Analytics Account Setup

#### 1.1 Create GA4 Property

Set up a new Google Analytics 4 property for modern analytics capabilities with enhanced measurement features.

#### 1.2 Configure Data Streams

Create a web data stream for your React application with enhanced measurement enabled for automatic event tracking.

#### 1.3 Retrieve Measurement ID

Get the GA4 Measurement ID (G-XXXXXXXXXX) that will be used to connect your React app to Google Analytics.

### 🤖 AI Learning Hints

**Where to start:**
_"I need to set up Google Analytics 4 for my React application. What are the fundamental concepts of GA4, data streams, events, and the differences from Universal Analytics?"_

**What key points to learn:**
_"I'm implementing product analytics with GA4. What are the key concepts of event-based tracking, user properties, conversion events, and the GA4 data model?"_

**How to create plan to execute:**
_"Guide me through setting up a new GA4 property, configuring data streams, and understanding the measurement ID setup for my React application."_

**How to troubleshoot using AI:**
_"I've created a GA4 property but I'm not sure if it's configured correctly. Here's my property settings and data stream configuration: [describe setup]. What should I verify before implementing in my app?"_

---

### Step 2: React Application Integration

#### 2.1 Install Google Analytics Libraries

Add the Google Analytics SDK to your React project using either gtag.js or react-ga4 library for easier React integration.

#### 2.2 Initialize GA4 in React App

Configure Google Analytics initialization with:

- Measurement ID from GA4 property
- Enhanced measurement for automatic tracking
- User consent management (if required)
- Debug mode for development environment

#### 2.3 Implement Page View Tracking

Set up automatic page view tracking for:

- Initial page loads
- React Router navigation changes
- Dynamic route parameters
- Page timing metrics

#### 2.4 Configure User Identification

Implement user tracking while respecting privacy:

- Anonymous user IDs for session tracking
- Authenticated user IDs (hashed) after login
- User properties for segmentation
- Consent management integration

### 🤖 AI Learning Hints

**Where to start:**
_"I need to integrate Google Analytics 4 into my React application. What are the best practices for GA4 implementation in single-page applications?"_

**What key points to learn:**
_"I'm adding GA4 to my React app with React Router. How do I properly track page views in a SPA, handle route changes, and ensure accurate session tracking?"_

**How to create plan to execute:**
_"Help me integrate GA4 into my React application step-by-step, including initialization, router integration, and basic event tracking setup."_

**How to troubleshoot using AI:**
_"Google Analytics isn't tracking my React route changes. Here's my GA4 initialization code and React Router setup: [paste code]. What's preventing proper page view tracking?"_

---

### Step 3: Custom Event Tracking

#### 3.1 Define Key User Actions

Identify and implement tracking for important user interactions:

- **Authentication Events:** login, logout, registration
- **Feature Usage:** button clicks, form submissions, feature access
- **User Journey:** onboarding steps, tutorial completion
- **Engagement Metrics:** time on page, scroll depth, video views

#### 3.2 Implement Event Tracking Code

Add GA4 event tracking for:

- Custom events with parameters
- Recommended events (GA4 standard)
- Enhanced ecommerce events (if applicable)
- Error events for frontend issues

#### 3.3 Set Up Conversion Events

Mark important events as conversions:

- User registration completion
- First feature usage
- Key action completion
- Business goal achievements

#### 3.4 Create Custom Dimensions

Define custom parameters for deeper analysis:

- User type or role
- Feature flags or A/B test variants
- Application version
- Custom user properties

### 🤖 AI Learning Hints

**Where to start:**
_"I need to implement custom event tracking in GA4 for my React app. What are the best practices for event naming, parameter structure, and conversion tracking?"_

**What key points to learn:**
_"I'm setting up custom events for user actions in GA4. How do I properly structure events, use recommended event names, add meaningful parameters, and mark conversions?"_

**How to create plan to execute:**
_"Help me design and implement a comprehensive event tracking strategy for my React app, including authentication events, feature usage, and conversion tracking."_

**How to troubleshoot using AI:**
_"My custom GA4 events aren't showing up in the real-time report. Here's my event tracking code: [paste code]. Help me debug why events aren't being sent to Google Analytics."_

---

### Step 4: Configure Analytics Reports

#### 4.1 Set Up Real-time Reports

Monitor live user activity with:

- Active users on site
- Real-time events firing
- Current page views
- Geographic distribution

#### 4.2 Create Custom Reports

Build reports for key metrics:

- User acquisition sources
- User engagement metrics
- Retention analysis
- Feature adoption rates

#### 4.3 Configure Audiences

Define user segments for analysis:

- New vs returning users
- Authenticated vs anonymous
- High-engagement users
- Geographic segments

#### 4.4 Set Up Dashboards

Create executive dashboards showing:

- Daily/weekly active users
- Top events and conversions
- User flow visualization
- Engagement trends

### 🤖 AI Learning Hints

**Where to start:**
_"I need to create meaningful reports in Google Analytics 4. What are the key reports and metrics I should focus on for a web application?"_

**What key points to learn:**
_"I'm building GA4 reports and dashboards. How do I create custom reports, define audiences, set up conversions, and build executive dashboards?"_

**How to create plan to execute:**
_"Guide me through creating essential GA4 reports including user acquisition, engagement metrics, retention analysis, and custom event reports."_

**How to troubleshoot using AI:**
_"My GA4 custom report isn't showing the data I expect. Here's my report configuration and the events I'm tracking: [describe setup]. What might be causing the discrepancy?"_

---

### Step 5: Test and Validate Analytics

#### 5.1 Use GA4 DebugView

Validate implementation using DebugView:

- Enable debug mode in development
- Verify events fire correctly
- Check event parameters
- Validate user properties

#### 5.2 Test User Journeys

Walk through critical user paths:

- New user registration flow
- Login and authentication
- Key feature interactions
- Conversion events

#### 5.3 Verify Data Collection

Confirm analytics data:

- Real-time reports show activity
- Events appear in reports within 24 hours
- No duplicate events
- Accurate user counts

#### 5.4 Document Analytics Setup

Create documentation including:

- GA4 property configuration
- Event tracking plan
- Report descriptions
- Access instructions for stakeholders

### Deliverables for Part B

- GA4 property created and configured
- React app integrated with Google Analytics
- Page view tracking implemented
- Custom events for key user actions
- Conversion events configured
- Reports and dashboards created
- Complete analytics documentation

### Success Criteria

- Page views tracked for all routes
- Custom events firing correctly
- User sessions properly tracked
- Conversion events recorded
- Reports showing meaningful data
- Team can access and interpret analytics

---

## Part C: Problem Discovery and Rapid Prototyping

### Overview

Shift focus from implementation to innovation by identifying organizational problems, proposing solutions, and building proof-of-concept prototypes for validation.

### Prerequisites

- Parts A and B completed (monitoring active)
- Understanding of organizational context
- Basic prototyping skills
- Access to stakeholders for feedback

### Step 1: Problem Identification

#### 1.1 Explore Problem Domains

Investigate different areas for potential problems:

- **Internal Problems:** Team productivity, communication, process inefficiencies
- **External Problems:** Customer pain points, market gaps, user experience issues
- **Department-Specific:** Engineering, sales, marketing, operations challenges
- **Business Problems:** Revenue, cost, growth, retention opportunities

#### 1.2 Conduct Quick Research

Gather information through:

- Informal conversations with colleagues
- Review of existing feedback/complaints
- Observation of current workflows
- Analysis of metrics from Parts A & B

#### 1.3 Document Problem Areas

Create brief problem statements for at least 3 areas:

- 1-2 sentence problem description
- Who is affected and how often
- Current impact or cost
- Potential value of solving

### 🤖 AI Learning Hints

**Where to start:**
_"I need to identify meaningful problems to solve in my organization. What are effective techniques for problem discovery, user research, and opportunity identification?"_

**What key points to learn:**
_"I'm exploring organizational problems across internal, external, department, and business domains. How do I identify high-value problems, validate their importance, and prioritize which to tackle?"_

**How to create plan to execute:**
_"Help me create a structured approach to problem discovery including research methods, stakeholder interviews, and problem validation techniques."_

**How to troubleshoot using AI:**
_"I'm struggling to identify meaningful problems in my organization. Here's what I've observed: [describe context]. Help me uncover hidden problems and validate their importance."_

---

### Step 2: Solution Proposals

#### 2.1 Brainstorm Solutions

For each identified problem, develop:

- High-level solution approach
- Technology or process changes needed
- Rough estimate of effort required
- Expected outcomes or benefits

#### 2.2 Evaluate Feasibility

Assess each solution for:

- Technical complexity
- Resource requirements
- Time to prototype
- Likelihood of success

#### 2.3 Select Prototype Candidate

Choose one solution to prototype based on:

- Maximum learning opportunity
- Reasonable scope for quick prototype
- Clear value proposition
- Stakeholder interest

#### 2.4 Create Proposal Documents

Write concise proposals (1 page each) containing:

- Problem statement
- Proposed solution
- Expected impact
- Prototype plan

### 🤖 AI Learning Hints

**Where to start:**
_"I've identified several organizational problems. How do I develop solution proposals that are compelling, feasible, and valuable?"_

**What key points to learn:**
_"I'm creating solution proposals for organizational problems. What are the key elements of a good proposal, how to estimate feasibility, and how to communicate value?"_

**How to create plan to execute:**
_"Guide me through creating concise, compelling solution proposals including problem framing, solution approach, impact assessment, and prototype planning."_

**How to troubleshoot using AI:**
_"My solution proposals seem too vague or ambitious. Here's one of my proposals: [paste proposal]. Help me refine it to be more concrete and achievable."_

---

### Step 3: Build Proof-of-Concept Prototype

#### 3.1 Define Prototype Scope

Determine minimum viable prototype:

- Core functionality to demonstrate
- What to mock or simulate
- Success criteria for prototype
- Time-boxed development (1-2 days max)

#### 3.2 Choose Appropriate Technology

Select tools for rapid prototyping:

- Low-code/no-code platforms for speed
- Existing frameworks from Week 1 if applicable
- Scripts or automation tools
- Mock data and simulated integrations

#### 3.3 Develop Prototype

Build the proof-of-concept:

- Focus on demonstrating core value
- Don't worry about production quality
- Use shortcuts and mock data
- Document assumptions and limitations

#### 3.4 Prepare Demo Materials

Create presentation materials:

- Problem-solution fit explanation
- Live demo or video walkthrough
- Metrics or KPIs it would impact
- Next steps if approved

### 🤖 AI Learning Hints

**Where to start:**
_"I need to build a rapid prototype to validate my solution. What are the best practices for proof-of-concept development and MVP scoping?"_

**What key points to learn:**
_"I'm building a prototype in 1-2 days. How do I scope appropriately, choose the right tools, focus on core value, and avoid over-engineering?"_

**How to create plan to execute:**
_"Help me plan a rapid prototype build including scope definition, technology selection, development approach, and demo preparation."_

**How to troubleshoot using AI:**
_"My prototype is taking too long to build. Here's my current scope and progress: [describe prototype]. Help me simplify and focus on the essential demonstration."_

---

### Step 4: Stakeholder Feedback and Iteration

#### 4.1 Schedule Feedback Sessions

Arrange meetings with:

- Direct stakeholders affected by problem
- Technical reviewers for feasibility
- Business stakeholders for value assessment
- Mentors for guidance

#### 4.2 Conduct Demonstrations

Present prototype with:

- Clear problem context
- Solution demonstration
- Proposed benefits
- Request for specific feedback

#### 4.3 Gather and Document Feedback

Collect input on:

- Problem validation
- Solution effectiveness
- Implementation concerns
- Priority and timing

#### 4.4 Iterate or Pivot

Based on feedback:

- Refine prototype if promising
- Document learnings if not viable
- Propose next steps for successful ideas
- Consider pivoting to other problems

### 🤖 AI Learning Hints

**Where to start:**
_"I need to get stakeholder feedback on my prototype. What are effective techniques for demos, feedback collection, and iteration?"_

**What key points to learn:**
_"I'm presenting my prototype to stakeholders. How do I structure the demo, facilitate feedback, handle criticism, and decide whether to iterate or pivot?"_

**How to create plan to execute:**
_"Help me prepare for stakeholder feedback sessions including demo structure, feedback questions, and iteration planning based on input received."_

**How to troubleshoot using AI:**
_"I received mixed feedback on my prototype. Here's what stakeholders said: [summarize feedback]. Help me interpret this feedback and decide next steps."_

---

### Step 5: Repository Integration and Documentation

#### 5.1 Commit Prototype Code

Add to repository:

- Prototype source code
- README with setup instructions
- Documentation of assumptions
- Sample data or configurations

#### 5.2 Document Proposals

Include in repository:

- All problem-solution proposals
- Feedback summaries
- Iteration notes
- Lessons learned

#### 5.3 Create Presentation Materials

Add presentation files:

- Slide decks or documents
- Demo videos or screenshots
- Stakeholder feedback forms
- Next steps documentation

#### 5.4 Update CI/CD Pipeline

If applicable, integrate prototype with:

- Separate branch or folder structure
- Build configuration for prototype
- Deployment instructions (if needed)
- Testing approach for prototype

### Deliverables for Part C

- At least 3 documented problem-solution proposals
- One working proof-of-concept prototype
- Stakeholder feedback documentation
- All materials committed to repository
- Presentation materials and demo
- Lessons learned document

### Success Criteria

- Problems identified across multiple domains
- Solutions proposed with clear value
- Prototype demonstrates core concept
- Stakeholder feedback collected
- Repository contains all artifacts
- Clear next steps identified

---

## Week 2 Completion Checklist

### Production Metrics (App Insights)

- [ ] Application Insights resource created and configured
- [ ] Backend API instrumented with SDK
- [ ] Four Golden Signals monitored (Latency, Errors, Traffic, Capacity)
- [ ] Custom and default logging implemented
- [ ] Critical alerts configured and tested
- [ ] Dashboards created and accessible
- [ ] Documentation provided

### Product Metrics (Google Analytics)

- [ ] GA4 property created and configured
- [ ] React app integrated with Analytics
- [ ] Page view tracking working
- [ ] Custom events implemented
- [ ] Conversion events configured
- [ ] Reports and dashboards created
- [ ] Analytics documentation complete

### Problem Discovery

- [ ] 3+ problems identified and documented
- [ ] Solution proposals created
- [ ] Proof-of-concept prototype built
- [ ] Stakeholder feedback collected
- [ ] All artifacts in repository
- [ ] Next steps defined

### Overall

- [ ] All code committed and pushed
- [ ] CI/CD pipeline updated
- [ ] Documentation complete
- [ ] Metrics collecting data
- [ ] Alerts functioning
- [ ] Team briefed on monitoring

## Additional Resources

### Monitoring Best Practices

- [Azure Application Insights Documentation](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics)
- [The Four Golden Signals](https://sre.google/sre-book/monitoring-distributed-systems/)

### Problem Discovery Resources

- Design Thinking methodologies
- Lean Startup principles
- User research techniques
- Rapid prototyping tools

### Troubleshooting Common Issues

- Application Insights not receiving data
- GA4 events not appearing
- Alert notifications not working
- Prototype deployment challenges
