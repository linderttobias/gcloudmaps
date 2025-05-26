# Infrastructure (Terraform)

This directory contains the Terraform configurations used to define and manage the Google Cloud infrastructure for gcloudmaps.com.

## Terraform Version

This project is configured to use **Terraform version 1.4.5**. It's important to use this specific version to ensure compatibility and avoid unexpected issues with state files or provider behavior.

You can check your installed Terraform version with:
```bash
terraform --version
```

### Installing Terraform 1.4.5

If you do not have Terraform installed or are using a different version, you can install version 1.4.5 using one of the following methods:

**1. Manual Installation (Linux Example):**

The following commands will download and install Terraform 1.4.5 for a Linux amd64 system:

```bash
# Remove existing Terraform binary if it's in your PATH and you want to replace it
# sudo rm $(which terraform) # Use with caution

wget https://releases.hashicorp.com/terraform/1.4.5/terraform_1.4.5_linux_amd64.zip
unzip terraform_1.4.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/terraform # Or any other directory in your PATH
rm terraform_1.4.5_linux_amd64.zip # Clean up the zip file
terraform --version # Verify installation
```
For other operating systems, download the appropriate package from the [Terraform 1.4.5 releases page](https://releases.hashicorp.com/terraform/1.4.5/).

**2. Using a Version Manager (Recommended):**

Tools like `tfenv` (for Linux/Mac) or `tfswitch` can help you manage multiple Terraform versions easily.

*   **tfenv:** [https://github.com/tfutils/tfenv](https://github.com/tfutils/tfenv)
    ```bash
    tfenv install 1.4.5
    tfenv use 1.4.5
    ```

## Usage

Standard Terraform commands are used to manage the infrastructure:

1.  **Navigate to the infrastructure directory:**
    ```bash
    cd infrastructure
    ```
2.  **Initialize Terraform:**
    This downloads the necessary providers and sets up the backend.
    ```bash
    terraform init
    ```
3.  **Plan Changes:**
    Review the changes Terraform will make.
    ```bash
    terraform plan
    ```
4.  **Apply Changes:**
    Provision or update the infrastructure.
    ```bash
    terraform apply
    ```

Please refer to the main repository README file for general project information and the `docs/architecture/` directory for diagrams of the cloud infrastructure. Consult the `.tf` files in this directory for details on specific resources.