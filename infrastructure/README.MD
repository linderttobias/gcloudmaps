## Terraform 

```bash
terraform --version
```

If terraform is not installed or wrong version use tfswitcher or donwgrade/uprage to 1.4.5

```bash
rm -r $(which terraform)

wget https://releases.hashicorp.com/terraform/1.4.5/terraform_1.4.5_linux_amd64.zip 

unzip terraform_1.4.5_linux_amd64.zip

mv terraform /usr/local/bin/terraform

terraform --version

```