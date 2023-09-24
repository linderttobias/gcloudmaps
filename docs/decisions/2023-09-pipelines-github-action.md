# Use GitHub Actions for all Pipelines

* **Last Updated:** 2023-09
* **Objective:** Determine the platform for ops automation.

## Context & Problem Statement

We need an environment for continuous delivery and other Cloud resource management (terraform)

## Priorities & Constraints <!-- optional -->

* Needs IAM privileges to access Cloud resources
* Has three critical roles:
  1. Automated testing for project maintenance
  2. Automate infrastructure managment (terraform)
  3. Automate build and deployment of Cloud Run 

## Considered Options

* Option 1: Cloud Build & Cloud Deploy
* Option 2: GitHub Actions


## Decision

Chosen option [Option 2: GitHub Actions]

With Workload Identity Federations I can increase security measures by not providing any service account keys anymore. Furthermore, I want to have a single place to store my repo and have an overview of pipelines and deployments
