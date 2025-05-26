[![backend - deployment](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/backend.yaml/badge.svg)](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/backend.yaml)
[![frontend - deployment](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/frontend.yaml/badge.svg)](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/frontend.yaml)
[![terraform - deployment](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/terraform.yaml/badge.svg)](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/terraform.yaml)
[![commit linting](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/lint.yaml/badge.svg)](https://github.com/hunderttausendwatt/gcloudmaps/actions/workflows/lint.yaml)

# gcloudmaps.com

gcloudmaps presents Google Cloud Services
as an interactive mind map with a minimalistic design. 
The platform allows users to explore various 
services by clicking on nodes, offering a 
straightforward way to understand 
Google's cloud offerings. The page is implemented
by using various Google Cloud Services and 
propagates Best Practices for Cloud.


![Gcloudmaps](docs/architecture/2023-12-03-gcloudmaps.png?raw=true "Gcloudmaps")
## Features

*   **Interactive Mind Map:** Explore Google Cloud services in a visual and interactive mind map format.
*   **Service Information:** Click on service nodes to get brief descriptions and links to official documentation.
*   **Minimalist Design:** Clean and intuitive interface for easy navigation.
*   **Best Practices:** Demonstrates best practices for cloud deployments on Google Cloud.

## Project Structure

This repository is organized into the following main directories:

*   `application/`: Contains the source code for the frontend (React) and backend (Python/Flask) applications.
*   `infrastructure/`: Includes Terraform configurations for deploying the necessary Google Cloud infrastructure.
*   `docs/`: Contains project documentation, including architecture diagrams and decision records.
*   `.github/`: Houses GitHub Actions workflows for CI/CD, linting, and other automation.

## Getting Started

To get started with developing or deploying gcloudmaps.com, please refer to the specific README files within the relevant directories:

*   **Application Development:** See `application/README.MD` for instructions on setting up and running the frontend and backend.
*   **Infrastructure Deployment:** See `infrastructure/README.MD` for details on using Terraform to deploy the cloud resources.

## Contributing

Contributions are welcome! If you'd like to contribute to gcloudmaps.com, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes, ensuring to follow existing code style and add relevant tests.
4.  Commit your changes with clear and descriptive messages.
5.  Push your branch to your fork.
6.  Submit a pull request to the main repository.

Please ensure your contributions align with the project's goals and coding standards.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
