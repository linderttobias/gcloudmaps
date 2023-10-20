# Frameworks for backend api

* **Status:** proposed
* **Last Updated:** 2023-10-20
* **Objective:**  Decide on a language and framework for implementing the backend api

## Context & Problem Statement

In light of an upcoming application restructure and a planned feature addition aimed at enhancing authentication and authorization, I am in the process of reevaluating the existing backend. It is advisable to reconsider the use of Node.js as the backend API in the current setup.

## Priorities & Constraints <!-- optional -->

* Application might require authorization in the future
* KISS (Keep it simple stupid) is priority nr. 1

## Considered Options

* Option 1: Python/Flask
* Option 2: Node.js

## Decision

Chosen option: **Option 1 - Python/Flask**

I (the team) possess substantial expertise in Python. Python is renowned for its readability and user-friendliness. Flask, a lightweight and adaptable framework, proves to be a suitable choice for small to medium-sized projects, offering strong support for database integrations and third-party libraries.
