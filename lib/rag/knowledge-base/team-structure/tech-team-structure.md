# Tech Team Structure

The tech team operates as a layered structure divided into three tier layers, each with distinct responsibilities and interdependencies.

## Tier 1: Infrastructure

**Focus**: Infrastructure reliability and cost effectiveness

The infrastructure tier provides the foundational platform that all other teams depend on. This team ensures systems are reliable, scalable, and cost-optimized.

### Team Members

- **DoND** - Team Optimus
- **SonNP** - Admin and IT Network

## Tier 2: Internal

**Focus**: Internal applications and data platform

The internal tier develops and maintains internal products for MindX operations, including:

- CRM (Customer Relationship Management)
- LMS (Learning Management System)
- Internal data dashboards

This tier depends on Tier 1 for infrastructure and reliability.

### Team Members

- **QuangBM** - Sales and School Operations
- **HoangNN** - Back Office Operations
- **QuanNM** - Marketing
- **DuyenTTT** - Internal Chat
- **ThuyPT** - Internal Customer Support

## Tier 3: External (Customer-Facing)

**Focus**: Customer-facing tech products

The external tier delivers technology products that directly serve MindX's customers—students and parents. This tier depends on:

- **Tier 2**: For internal data, processes, and operations
- **Tier 1**: For infrastructure and reliability

### Team Members

- **ThuanTV** - External Chat
- **YenNH** - Compass (Parent's mobile app) & Denise (Student's learning app) - Team Falcon
- **TrungNK** - Compass (Parent's mobile app) & Denise (Student's learning app) - Team Falcon

## Dependencies

```
Tier 3 (External/Customer-Facing)
    ↓ depends on
Tier 2 (Internal Platform)
    ↓ depends on
Tier 1 (Infrastructure)
```

The relationship is hierarchical: upper tiers depend on lower tiers for their respective domains—Tier 3 relies on Tier 2 for internal capabilities and both Tiers 2 and 3 rely on Tier 1 for infrastructure foundation.

## ASCII Diagram

```
                           TECH TEAM STRUCTURE

┌──────────────────────────────────────────────────────────────────────┐
│                    TIER 3: External (Customer-Facing)                │
│                    Focus: Customer-facing tech products              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  • ThuanTV ─────────────── External Chat                           │
│                                                                      │
│  • YenNH ──┐                                                        │
│            ├─── Compass & Denise (Team Falcon)                     │
│  • TrungNK ┘                                                        │
│                                                                      │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ depends on
                             ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    TIER 2: Internal Platform                         │
│         Focus: Internal applications and data platform               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  • QuangBM ────────────── Sales & School Operations                │
│  • HoangNN ────────────── Back Office Operations                   │
│  • QuanNM ─────────────── Marketing                                │
│  • DuyenTTT ───────────── Internal Chat                            │
│  • ThuyPT ─────────────── Internal Customer Support                │
│                                                                      │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ depends on
                             ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    TIER 1: Infrastructure                            │
│         Focus: Infrastructure reliability & cost effectiveness       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  • DoND ────────────────── Team Optimus                            │
│                                                                      │
│  • SonNP ──────────────── Admin and IT Network                     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Metadata

- **Created**: 2025-01-27T06:11:36.204Z
- **Updated**: 2025-01-27T06:11:36.204Z
- **Status**: Active
- **Children**: 0 items
